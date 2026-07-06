"""Lógica pura do protocolo Needham-Schroeder (1978).

Cada função constrói ou interpreta uma das 5 mensagens do protocolo,
espelhando o pseudocódigo do relatório parcial. Nenhuma função aqui faz I/O
de rede -- apenas cifra/decifra e valida campos -- para que a lógica do
protocolo possa ser lida e testada isoladamente dos papéis de rede
(kdc.py, alice.py, bob.py).

Notação: {M}_K significa "mensagem M cifrada com a chave K".
"""
import os

import crypto_utils as cu


def generate_nonce() -> int:
    return int.from_bytes(os.urandom(8), "big")


# ---------------------------------------------------------------------------
# Passo 1/2: KDC
# ---------------------------------------------------------------------------

def kdc_build_response(A: str, B: str, N_A: int, K_A: bytes, K_B: bytes) -> tuple[dict, bytes]:
    """Passo 2: KDC → A : {N_A, B, K_s, {K_s, A}_K_B}_K_A

    Gera uma nova chave de sessão K_s e monta a resposta cifrada para Alice,
    contendo o ticket destinado a Bob. Retorna também K_s em claro para o
    chamador (usada pelo demo para simular seu comprometimento posterior).
    """
    K_s = cu.generate_session_key()
    ticket_b = cu.aes_encrypt({"K_s": cu.to_b64(K_s), "A": A}, K_B)
    inner = {
        "N_A": N_A,
        "B": B,
        "K_s": cu.to_b64(K_s),
        "ticket_B": cu.to_b64(ticket_b),
    }
    payload = cu.aes_encrypt(inner, K_A)
    message = {"type": "NS2", "payload": cu.to_b64(payload)}
    return message, K_s


# ---------------------------------------------------------------------------
# Alice
# ---------------------------------------------------------------------------

def alice_parse_kdc_response(message: dict, N_A_expected: int, B_expected: str, K_A: bytes) -> tuple[bytes, str]:
    """Passo 2 (lado de Alice): decifra a resposta do KDC com K_A, confirma
    que o nonce e a identidade de B batem com o pedido original, e devolve
    (K_s, ticket_B em base64) para repassar a Bob no passo 3.
    """
    payload = cu.from_b64(message["payload"])
    inner = cu.aes_decrypt(payload, K_A)
    if inner["N_A"] != N_A_expected:
        raise ValueError("Nonce N_A não corresponde -- resposta rejeitada")
    if inner["B"] != B_expected:
        raise ValueError("Identidade de B não corresponde -- resposta rejeitada")
    K_s = cu.from_b64(inner["K_s"])
    return K_s, inner["ticket_B"]


def alice_build_ticket_message(ticket_B_b64: str) -> dict:
    """Passo 3: A → B : {K_s, A}_K_B

    Alice apenas repassa o ticket para Bob -- ele é opaco para ela, pois
    está cifrado com K_B.
    """
    return {"type": "NS3", "ticket": ticket_B_b64}


def alice_parse_challenge(message: dict, K_s: bytes) -> int:
    """Passo 4 (lado de Alice): decifra o desafio de Bob com K_s e extrai N_B."""
    payload = cu.from_b64(message["payload"])
    inner = cu.aes_decrypt(payload, K_s)
    return inner["N_B"]


def alice_build_challenge_response(N_B: int, K_s: bytes) -> dict:
    """Passo 5: A → B : {N_B - 1}_K_s

    Alice prova que conhece K_s respondendo corretamente ao desafio.
    """
    payload = cu.aes_encrypt({"N_B_minus_1": N_B - 1}, K_s)
    return {"type": "NS5", "payload": cu.to_b64(payload)}


# ---------------------------------------------------------------------------
# Bob
# ---------------------------------------------------------------------------

def bob_parse_ticket(message: dict, K_B: bytes) -> tuple[bytes, str]:
    """Passo 3 (lado de Bob): decifra o ticket com K_B e obtém K_s e a
    identidade alegada do remetente.

    Importante: este passo não verifica se o ticket é recente -- é
    exatamente essa lacuna que o ataque de repetição explora, e que o
    Denning-Sacco corrige com um timestamp (ver ds_protocol.py).
    """
    ticket_blob = cu.from_b64(message["ticket"])
    inner = cu.aes_decrypt(ticket_blob, K_B)
    K_s = cu.from_b64(inner["K_s"])
    return K_s, inner["A"]


def bob_build_challenge(N_B: int, K_s: bytes) -> dict:
    """Passo 4: B → A : {N_B}_K_s

    Bob desafia a outra parte a provar que possui a chave de sessão.
    """
    payload = cu.aes_encrypt({"N_B": N_B}, K_s)
    return {"type": "NS4", "payload": cu.to_b64(payload)}


def bob_verify_challenge_response(message: dict, N_B: int, K_s: bytes) -> bool:
    """Passo 5 (lado de Bob): decifra a resposta ao desafio e confirma que é
    N_B - 1. Se verdadeiro, a sessão é considerada estabelecida.
    """
    payload = cu.from_b64(message["payload"])
    inner = cu.aes_decrypt(payload, K_s)
    return inner["N_B_minus_1"] == N_B - 1
