# Needham-Schroeder e Denning-Sacco: Implementação, Análise de Vulnerabilidades e Ataques

Implementação dos protocolos de distribuição de chaves de sessão
**Needham-Schroeder (NS, 1978)** e **Denning-Sacco (DS, 1981)**, com
demonstração prática do ataque de repetição (*replay attack*) contra o NS e
da defesa do DS baseada em timestamp.

Trabalho da disciplina INE5429 - Segurança da Computação (UFSC).
Autoras: Lívia Corazza Ferrão e Bianca Mazzuco Verzola.

## Requisitos

- Python 3.10+
- Biblioteca `cryptography`

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Como executar

```bash
python3 run_demo.py
```

O script sobe um KDC e um Bob reais (sockets TCP em `localhost`) em
threads e executa três cenários em sequência, imprimindo no console cada
mensagem trocada entre as partes:

1. **NS legítimo** — Alice e Bob completam os 5 passos do Needham-Schroeder
   e estabelecem uma sessão.
2. **Ataque de repetição contra o NS** — Mallory reenvia o ticket e a chave
   de sessão capturados no cenário 1. Como o NS não verifica se o ticket é
   recente, **Bob aceita a sessão forjada** — a vulnerabilidade é
   reproduzida de fato, não apenas descrita.
3. **DS com defesa** — Alice e Bob completam o handshake do Denning-Sacco
   (com timestamp `T` embutido no ticket). O script aguarda a janela de
   validade (`DELTA_T`) expirar de verdade e Mallory tenta o mesmo replay:
   desta vez **Bob rejeita** o ticket por timestamp expirado.

Toda a criptografia (AES-CBC), a comunicação (sockets TCP) e a espera pela
expiração do timestamp são reais — nada é simulado ou mockado.

## Estrutura dos módulos

| Arquivo | Responsabilidade |
|---|---|
| `crypto_utils.py` | Chaves de longo prazo (K_A, K_B), geração de K_s, cifra/decifra AES-CBC com padding PKCS7 |
| `net_utils.py` | Framing de mensagens JSON sobre socket TCP (length-prefix) |
| `ns_protocol.py` | Lógica pura dos 5 passos do Needham-Schroeder (sem I/O de rede) |
| `ds_protocol.py` | Lógica pura dos 3 passos do Denning-Sacco, incluindo verificação de timestamp (sem I/O de rede) |
| `kdc.py` | Papel do KDC: servidor TCP que responde aos pedidos de chave de sessão |
| `bob.py` | Papel de Bob: servidor TCP (portas separadas para NS e DS) que recebe tickets e completa o handshake |
| `alice.py` | Papel de Alice: inicia os protocolos, falando com o KDC e com Bob |
| `mallory.py` | Papel do intruso: reproduz um ticket (e, no caso do NS, uma K_s) capturados de uma sessão anterior |
| `run_demo.py` | Orquestra os três cenários acima e imprime os resultados |

`ns_protocol.py` e `ds_protocol.py` contêm apenas lógica de protocolo
(construção/interpretação de mensagens) e podem ser lidos e entendidos sem
depender de sockets. `kdc.py`, `alice.py`, `bob.py` e `mallory.py` cuidam
exclusivamente da comunicação de rede, delegando a lógica do protocolo para
esses dois módulos.

Cada papel também pode ser executado como processo independente
(`python3 kdc.py`, `python3 bob.py`, `python3 alice.py`) em terminais
separados, para uma demonstração multi-processo em vez de multi-thread.

## Portas usadas

- KDC: `127.0.0.1:9000`
- Bob (NS): `127.0.0.1:9001`
- Bob (DS): `127.0.0.1:9002`
