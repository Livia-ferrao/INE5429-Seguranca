"""Papel de Alice: inicia os protocolos NS e DS, falando com o KDC e com Bob
por sockets TCP reais.
"""
import socket

import bob as bob_mod
import crypto_utils as cu
import ds_protocol as ds
import kdc as kdc_mod
import net_utils as nu
import ns_protocol as ns

K_A = cu.LONG_TERM_KEYS["alice"]


def alice_ns(
    name: str = "alice",
    peer: str = "bob",
    kdc_host: str = kdc_mod.HOST,
    kdc_port: int = kdc_mod.PORT,
    bob_host: str = bob_mod.HOST,
    bob_port: int = bob_mod.NS_PORT,
) -> dict:
    """Executa os 5 passos do NS do lado de Alice. Retorna K_s e o ticket
    (bytes cifrados, opacos para Alice) obtidos do KDC -- justamente o
    material que um atacante precisaria capturar/comprometer para montar o
    ataque de repetição (ver mallory.py).
    """
    N_A = ns.generate_nonce()

    with socket.create_connection((kdc_host, kdc_port)) as kdc_conn:
        print(f"[Alice-NS] Passo 1 -> KDC: A={name}, B={peer}, N_A={N_A}")
        nu.send_json(kdc_conn, {"type": "NS1", "A": name, "B": peer, "N_A": N_A})
        msg2 = nu.recv_json(kdc_conn)
    print("[Alice-NS] Passo 2 <- KDC: resposta {N_A,B,K_s,ticket_B}_K_A recebida")

    K_s, ticket_b64 = ns.alice_parse_kdc_response(msg2, N_A, peer, K_A)

    with socket.create_connection((bob_host, bob_port)) as bob_conn:
        print("[Alice-NS] Passo 3 -> Bob: repassando ticket {K_s,A}_K_B")
        nu.send_json(bob_conn, ns.alice_build_ticket_message(ticket_b64))

        msg4 = nu.recv_json(bob_conn)
        N_B = ns.alice_parse_challenge(msg4, K_s)
        print(f"[Alice-NS] Passo 4 <- Bob: desafio N_B={N_B}")

        print(f"[Alice-NS] Passo 5 -> Bob: resposta N_B-1={N_B - 1}")
        nu.send_json(bob_conn, ns.alice_build_challenge_response(N_B, K_s))

    return {"K_s": K_s, "ticket": cu.from_b64(ticket_b64)}


def alice_ds(
    name: str = "alice",
    peer: str = "bob",
    kdc_host: str = kdc_mod.HOST,
    kdc_port: int = kdc_mod.PORT,
    bob_host: str = bob_mod.HOST,
    bob_port: int = bob_mod.DS_PORT,
) -> dict:
    """Executa os 3 passos do DS do lado de Alice."""
    with socket.create_connection((kdc_host, kdc_port)) as kdc_conn:
        print(f"[Alice-DS] Passo 1 -> KDC: A={name}, B={peer}")
        nu.send_json(kdc_conn, {"type": "DS1", "A": name, "B": peer})
        msg2 = nu.recv_json(kdc_conn)
    print("[Alice-DS] Passo 2 <- KDC: resposta {B,K_s,T,ticket_B}_K_A recebida")

    K_s, ticket_b64, T = ds.alice_parse_kdc_response(msg2, peer, K_A)

    with socket.create_connection((bob_host, bob_port)) as bob_conn:
        print(f"[Alice-DS] Passo 3 -> Bob: repassando ticket {{K_s,A,T}}_K_B (T={T:.3f})")
        nu.send_json(bob_conn, ds.alice_build_ticket_message(ticket_b64))

    return {"K_s": K_s, "ticket": cu.from_b64(ticket_b64), "T": T}


if __name__ == "__main__":
    alice_ns()
