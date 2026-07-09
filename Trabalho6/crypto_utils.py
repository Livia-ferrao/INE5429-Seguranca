"""Funções de criptografia (AES-CBC) usadas pelos protocolos NS e DS.

As chaves de longo prazo (K_A, K_B) representam segredos pré-compartilhados
entre cada usuário e o KDC, estabelecidos fora de banda antes da execução do
protocolo -- exatamente a premissa assumida pelo Needham-Schroeder e pelo
Denning-Sacco. Aqui elas são constantes fixas porque este é um ambiente de
demonstração controlado, não um sistema de gerenciamento de chaves real.
"""
import base64
import json
import os

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

AES_KEY_SIZE = 16  # AES-128
AES_BLOCK_SIZE = 16  # bytes (128 bits)

# Chaves de longo prazo pré-distribuídas (K_A e K_B do relatório).
LONG_TERM_KEYS = {
    "alice": bytes.fromhex("000102030405060708090a0b0c0d0e0f"[:32]),
    "bob": bytes.fromhex("101112131415161718191a1b1c1d1e1f"[:32]),
}


def generate_session_key() -> bytes:
    """Gera uma chave de sessão K_s aleatória (gerada pelo KDC a cada troca)."""
    return os.urandom(AES_KEY_SIZE)


def aes_encrypt(plaintext_obj: dict, key: bytes) -> bytes:
    """Serializa plaintext_obj em JSON, aplica padding PKCS7 e cifra com
    AES-CBC usando um IV aleatório. Retorna IV || ciphertext.
    """
    data = json.dumps(plaintext_obj).encode("utf-8")
    padder = padding.PKCS7(AES_BLOCK_SIZE * 8).padder()
    padded = padder.update(data) + padder.finalize()

    iv = os.urandom(AES_BLOCK_SIZE)
    encryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    return iv + ciphertext


def aes_decrypt(blob: bytes, key: bytes) -> dict:
    """Inverso de aes_encrypt: separa IV, decifra, remove padding e faz
    parse do JSON resultante.
    """
    iv, ciphertext = blob[:AES_BLOCK_SIZE], blob[AES_BLOCK_SIZE:]
    decryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()
    padded = decryptor.update(ciphertext) + decryptor.finalize()

    unpadder = padding.PKCS7(AES_BLOCK_SIZE * 8).unpadder()
    data = unpadder.update(padded) + unpadder.finalize()

    return json.loads(data.decode("utf-8"))


def to_b64(blob: bytes) -> str:
    """Codifica bytes cifrados para embutir em uma mensagem JSON."""
    return base64.b64encode(blob).decode("ascii")


def from_b64(text: str) -> bytes:
    """Decodifica um campo base64 vindo de uma mensagem JSON de volta para bytes."""
    return base64.b64decode(text)
