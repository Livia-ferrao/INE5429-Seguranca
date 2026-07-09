"""Servidor do Centro de Distribuição de Chaves (KDC).

Escuta conexões TCP reais e responde aos pedidos de chave de sessão dos
protocolos NS (mensagem "NS1") e DS (mensagem "DS1"), delegando a lógica de
cada protocolo para ns_protocol.py / ds_protocol.py. O KDC conhece as
chaves de longo prazo de todos os usuários cadastrados (crypto_utils.LONG_TERM_KEYS).

Pode ser executado como processo independente (`python kdc.py`) ou
importado e rodado em uma thread por run_demo.py.
"""
import socket
import threading

import crypto_utils as cu
import ds_protocol as ds
import net_utils as nu
import ns_protocol as ns

HOST = "127.0.0.1"
PORT = 9000


def handle_connection(conn: socket.socket) -> None:
    with conn:
        request = nu.recv_json(conn)
        if request is None:
            return

        A = request["A"]
        B = request["B"]
        K_A = cu.LONG_TERM_KEYS[A]
        K_B = cu.LONG_TERM_KEYS[B]

        if request["type"] == "NS1":
            response, _K_s = ns.kdc_build_response(A, B, request["N_A"], K_A, K_B)
        elif request["type"] == "DS1":
            response, _K_s, _T = ds.kdc_build_response(A, B, K_A, K_B)
        else:
            response = {"type": "ERROR", "reason": f"tipo de pedido desconhecido: {request['type']}"}

        nu.send_json(conn, response)


def run_server(host: str = HOST, port: int = PORT, stop_event: threading.Event | None = None) -> None:
    """Sobe o servidor do KDC. Bloqueia aceitando conexões até stop_event
    ser sinalizado (ou para sempre, se nenhum stop_event for passado --
    útil ao rodar kdc.py como processo independente).
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((host, port))
        server.listen()
        server.settimeout(0.5)
        print(f"[KDC] escutando em {host}:{port}")

        while stop_event is None or not stop_event.is_set():
            try:
                conn, _addr = server.accept()
            except socket.timeout:
                continue
            threading.Thread(target=handle_connection, args=(conn,), daemon=True).start()


if __name__ == "__main__":
    run_server()
