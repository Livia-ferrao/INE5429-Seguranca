"""Papel de Bob: recebe tickets do KDC (via Alice ou, no cenário de ataque,
diretamente de Mallory) e completa o handshake de cada protocolo.

Usa duas portas TCP separadas -- uma para NS e outra para DS -- para que os
dois protocolos possam ser demonstrados lado a lado sem se misturar.

Pode ser executado como processo independente (`python bob.py`) ou
importado e rodado em threads por run_demo.py.
"""
import socket
import threading

import crypto_utils as cu
import ds_protocol as ds
import net_utils as nu
import ns_protocol as ns

HOST = "127.0.0.1"
NS_PORT = 9001
DS_PORT = 9002

K_B = cu.LONG_TERM_KEYS["bob"]


def handle_ns_connection(conn: socket.socket) -> None:
    """Passos 3-5 do NS do lado de Bob."""
    with conn:
        msg3 = nu.recv_json(conn)
        if msg3 is None or msg3.get("type") != "NS3":
            return

        K_s, A_claimed = ns.bob_parse_ticket(msg3, K_B)

        N_B = ns.generate_nonce()
        challenge = ns.bob_build_challenge(N_B, K_s)
        nu.send_json(conn, challenge)

        msg5 = nu.recv_json(conn)
        if msg5 is None:
            print("[Bob-NS] conexão encerrada antes do passo 5")
            return

        if ns.bob_verify_challenge_response(msg5, N_B, K_s):
            print(f"[Bob-NS] sessão estabelecida com '{A_claimed}' (K_s={K_s.hex()[:8]}...)")
        else:
            print(f"[Bob-NS] falha na autenticação de '{A_claimed}' -- desafio incorreto")


def handle_ds_connection(conn: socket.socket) -> None:
    """Passo 3 do DS do lado de Bob (com verificação de timestamp)."""
    with conn:
        msg3 = nu.recv_json(conn)
        if msg3 is None or msg3.get("type") != "DS3":
            return

        K_s, A_claimed, _T, accepted, reason = ds.bob_parse_and_validate_ticket(msg3, K_B)

        if accepted:
            print(f"[Bob-DS] sessão estabelecida com '{A_claimed}' (K_s={K_s.hex()[:8]}...)")
        else:
            print(f"[Bob-DS] ticket de '{A_claimed}' REJEITADO -- {reason}")


def _serve(host: str, port: int, handler, stop_event: threading.Event | None) -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((host, port))
        server.listen()
        server.settimeout(0.5)
        print(f"[Bob] escutando em {host}:{port}")

        while stop_event is None or not stop_event.is_set():
            try:
                conn, _addr = server.accept()
            except socket.timeout:
                continue
            threading.Thread(target=handler, args=(conn,), daemon=True).start()


def run_ns_server(host: str = HOST, port: int = NS_PORT, stop_event: threading.Event | None = None) -> None:
    _serve(host, port, handle_ns_connection, stop_event)


def run_ds_server(host: str = HOST, port: int = DS_PORT, stop_event: threading.Event | None = None) -> None:
    _serve(host, port, handle_ds_connection, stop_event)


if __name__ == "__main__":
    threading.Thread(target=run_ns_server, daemon=True).start()
    run_ds_server()
