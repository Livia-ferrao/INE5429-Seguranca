"""Lógica pura do protocolo Denning-Sacco (1981).

Correção do Needham-Schroeder que troca o mecanismo de desafio-resposta
(passos 4/5 do NS) por uma marca temporal T dentro do próprio ticket: Bob
aceita a sessão apenas se T estiver dentro de uma janela de tempo aceitável
(DELTA_T), o que inviabiliza o replay de um ticket antigo.

Por simplicidade, T é representado como um timestamp Unix (segundos desde
1970, float) em vez de uma string de data -- equivalente ao "T" do
relatório, só que mais fácil de comparar aritmeticamente.

Assim como em ns_protocol.py, nenhuma função aqui faz I/O de rede.
"""
import time

import crypto_utils as cu

# Janela de aceitação do timestamp. O relatório parcial usa 5 minutos como
# exemplo ilustrativo; aqui usamos um valor pequeno para que a demonstração
# do ataque de repetição (que precisa esperar o ticket expirar) rode em
# poucos segundos, sem alterar a lógica do protocolo.
DEFAULT_DELTA_T_SECONDS = 3


# ---------------------------------------------------------------------------
# Passo 1/2: KDC
# ---------------------------------------------------------------------------

def kdc_build_response(A: str, B: str, K_A: bytes, K_B: bytes) -> tuple[dict, bytes, float]:
    """Passo 2: KDC → A : {B, K_s, T, {K_s, A, T}_K_B}_K_A

    Gera K_s e registra o timestamp atual T. Retorna (mensagem DS2, K_s, T).
    """
    K_s = cu.generate_session_key()
    T = time.time()
    ticket_b = cu.aes_encrypt({"K_s": cu.to_b64(K_s), "A": A, "T": T}, K_B)
    inner = {
        "B": B,
        "K_s": cu.to_b64(K_s),
        "T": T,
        "ticket_B": cu.to_b64(ticket_b),
    }
    payload = cu.aes_encrypt(inner, K_A)
    message = {"type": "DS2", "payload": cu.to_b64(payload)}
    return message, K_s, T


# ---------------------------------------------------------------------------
# Alice
# ---------------------------------------------------------------------------

def alice_parse_kdc_response(message: dict, B_expected: str, K_A: bytes) -> tuple[bytes, str, float]:
    """Passo 2 (lado de Alice): decifra a resposta do KDC com K_A e devolve
    (K_s, ticket_B em base64, T) para repassar o ticket a Bob no passo 3.
    """
    payload = cu.from_b64(message["payload"])
    inner = cu.aes_decrypt(payload, K_A)
    if inner["B"] != B_expected:
        raise ValueError("Identidade de B não corresponde -- resposta rejeitada")
    K_s = cu.from_b64(inner["K_s"])
    return K_s, inner["ticket_B"], inner["T"]


def alice_build_ticket_message(ticket_B_b64: str) -> dict:
    """Passo 3: A → B : {K_s, A, T}_K_B"""
    return {"type": "DS3", "ticket": ticket_B_b64}


# ---------------------------------------------------------------------------
# Bob
# ---------------------------------------------------------------------------

def bob_parse_and_validate_ticket(
    message: dict,
    K_B: bytes,
    delta_t_seconds: float = DEFAULT_DELTA_T_SECONDS,
    now_fn=time.time,
) -> tuple[bytes, str, float, bool, str]:
    """Passo 3 (lado de Bob): decifra o ticket com K_B, obtém K_s, a
    identidade alegada de A e o timestamp T, e verifica se |agora - T| está
    dentro da janela DELTA_T.

    Retorna (K_s, A_claimed, T, aceito, motivo_da_rejeicao).
    """
    ticket_blob = cu.from_b64(message["ticket"])
    inner = cu.aes_decrypt(ticket_blob, K_B)
    K_s = cu.from_b64(inner["K_s"])
    T = inner["T"]

    diff = abs(now_fn() - T)
    if diff <= delta_t_seconds:
        return K_s, inner["A"], T, True, ""

    reason = (
        f"ticket expirado: |agora - T| = {diff:.1f}s excede a janela "
        f"de {delta_t_seconds}s"
    )
    return K_s, inner["A"], T, False, reason
