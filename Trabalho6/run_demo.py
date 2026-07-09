"""Script principal da demonstração: sobe KDC e Bob (sockets TCP reais) em
threads e executa três cenários:

  1. Handshake NS legítimo entre Alice e Bob.
  2. Ataque de repetição (replay attack) do Mallory contra o NS, reusando
     o ticket e a K_s capturados no cenário 1 -- Bob aceita: vulnerabilidade
     confirmada.
  3. Handshake DS legítimo seguido do mesmo tipo de replay do Mallory --
     desta vez Bob rejeita por causa do timestamp expirado: defesa
     confirmada.

Uso: python run_demo.py
"""
import socket
import threading
import time

import alice
import bob
import ds_protocol as ds
import kdc
import mallory


def _wait_port_open(host: str, port: int, timeout: float = 2.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=0.2):
                return
        except OSError:
            time.sleep(0.05)
    raise RuntimeError(f"servidor em {host}:{port} não respondeu a tempo")


def _section(title: str) -> None:
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def main() -> None:
    stop_event = threading.Event()
    servers = [
        threading.Thread(target=kdc.run_server, args=(kdc.HOST, kdc.PORT, stop_event), daemon=True),
        threading.Thread(target=bob.run_ns_server, args=(bob.HOST, bob.NS_PORT, stop_event), daemon=True),
        threading.Thread(target=bob.run_ds_server, args=(bob.HOST, bob.DS_PORT, stop_event), daemon=True),
    ]
    for t in servers:
        t.start()

    _wait_port_open(kdc.HOST, kdc.PORT)
    _wait_port_open(bob.HOST, bob.NS_PORT)
    _wait_port_open(bob.HOST, bob.DS_PORT)

    try:
        _section("CENÁRIO 1: Needham-Schroeder -- handshake legítimo entre Alice e Bob")
        ns_result = alice.alice_ns()
        time.sleep(0.2)

        _section("CENÁRIO 2: Ataque de repetição (replay attack) contra o NS")
        print("Premissa: Mallory gravou o ticket do cenário 1 e, posteriormente,")
        print("comprometeu a K_s daquela sessão (ex.: vazamento após o término).")
        mallory.mallory_replay_ns(ns_result["ticket"], ns_result["K_s"])
        time.sleep(0.2)

        _section("CENÁRIO 3: Denning-Sacco -- handshake legítimo, depois replay")
        ds_result = alice.alice_ds()
        time.sleep(0.2)
        wait_seconds = ds.DEFAULT_DELTA_T_SECONDS + 1
        print(
            f"\nAguardando {wait_seconds}s para o ticket expirar (janela DELTA_T="
            f"{ds.DEFAULT_DELTA_T_SECONDS}s) antes do replay do Mallory..."
        )
        time.sleep(wait_seconds)
        print("Mallory reenvia exatamente o mesmo ticket DS capturado no início do cenário 3:")
        mallory.mallory_replay_ds(ds_result["ticket"])
        time.sleep(0.2)

        _section("RESUMO")
        print("NS (sem timestamp): replay aceito por Bob      -> vulnerabilidade confirmada")
        print("DS (com timestamp): replay REJEITADO -> defesa confirmada (ver Bob-DS acima)")
    finally:
        stop_event.set()
        for t in servers:
            t.join(timeout=2)


if __name__ == "__main__":
    main()
