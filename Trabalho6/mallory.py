"""Papel de Mallory: o intruso que grava tráfego de uma sessão legítima
anterior e tenta reutilizá-lo (ataque de repetição / replay attack) contra
Bob, se passando por Alice.

Mallory conecta diretamente ao socket de Bob (não passa pelo KDC nem por
Alice) e reenvia bytes reais de um ticket capturado anteriormente -- os
mesmos que alice.py obteve do KDC em uma execução legítima. Quem fornece
esse material capturado é o orquestrador (run_demo.py), representando a
premissa de que Mallory: (1) grava o tráfego de rede (sniffing) e, no caso
do NS, (2) compromete K_s posteriormente por algum outro meio -- exatamente
o cenário descrito por Denning e Sacco (1981) para o ataque original.
"""
import socket

import bob as bob_mod
import crypto_utils as cu
import ds_protocol as ds
import net_utils as nu
import ns_protocol as ns


def mallory_replay_ns(
    ticket_bytes: bytes,
    K_s_antiga: bytes,
    bob_host: str = bob_mod.HOST,
    bob_port: int = bob_mod.NS_PORT,
) -> None:
    """Reproduz os passos 3'-5' do NS usando um ticket e uma K_s capturados
    de uma sessão anterior. Se Bob aceitar, a vulnerabilidade é confirmada
    (ver impressão feita por bob.handle_ns_connection no console).
    """
    ticket_b64 = cu.to_b64(ticket_bytes)
    with socket.create_connection((bob_host, bob_port)) as conn:
        print("[Mallory] Passo 3' -> Bob: reenviando ticket capturado {K_s_antiga,A}_K_B")
        nu.send_json(conn, ns.alice_build_ticket_message(ticket_b64))

        msg4 = nu.recv_json(conn)
        N_B = ns.alice_parse_challenge(msg4, K_s_antiga)
        print(f"[Mallory] Passo 4' <- Bob: desafio N_B={N_B}")

        print(f"[Mallory] Passo 5' -> Bob: resposta N_B-1={N_B - 1} (usando K_s_antiga vazada)")
        nu.send_json(conn, ns.alice_build_challenge_response(N_B, K_s_antiga))

    print("[Mallory] replay NS concluído -- verifique acima se Bob-NS estabeleceu a sessão")


def mallory_replay_ds(
    ticket_bytes: bytes,
    bob_host: str = bob_mod.HOST,
    bob_port: int = bob_mod.DS_PORT,
) -> None:
    """Tenta o mesmo replay contra o Bob que roda o DS. Diferente do NS,
    Mallory não precisa conhecer K_s aqui -- basta reenviar o ticket
    interceptado -- mas o timestamp embutido nele entrega o ataque: se T
    estiver fora da janela de aceitação (DELTA_T), Bob rejeita.
    """
    ticket_b64 = cu.to_b64(ticket_bytes)
    with socket.create_connection((bob_host, bob_port)) as conn:
        print("[Mallory] Passo 3' -> Bob: reenviando ticket DS capturado {K_s,A,T}_K_B")
        nu.send_json(conn, ds.alice_build_ticket_message(ticket_b64))
    print("[Mallory] replay DS concluído -- verifique acima se Bob-DS aceitou ou rejeitou o ticket")


if __name__ == "__main__":
    print("mallory.py é usado via run_demo.py, que fornece o ticket/K_s capturados.")
