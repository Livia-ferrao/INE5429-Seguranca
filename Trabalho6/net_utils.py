"""Framing de mensagens JSON sobre sockets TCP.

Todas as mensagens dos protocolos NS/DS trafegam como objetos JSON (com os
trechos cifrados embutidos em base64). Como TCP é um fluxo de bytes sem
delimitação de mensagens, usamos um prefixo de 4 bytes (big-endian) com o
tamanho do payload antes de cada mensagem.
"""
import json
import socket


def send_json(sock: socket.socket, obj: dict) -> None:
    payload = json.dumps(obj).encode("utf-8")
    header = len(payload).to_bytes(4, "big")
    sock.sendall(header + payload)


def recv_json(sock: socket.socket) -> dict | None:
    header = _recv_exact(sock, 4)
    if header is None:
        return None
    length = int.from_bytes(header, "big")
    payload = _recv_exact(sock, length)
    if payload is None:
        return None
    return json.loads(payload.decode("utf-8"))


def _recv_exact(sock: socket.socket, n: int) -> bytes | None:
    buf = bytearray()
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            return None
        buf.extend(chunk)
    return bytes(buf)
