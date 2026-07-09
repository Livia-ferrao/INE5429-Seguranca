def monobit_test(bits):
    n = len(bits)

    # conta quantidade de '1'
    ones = bits.count('1')
    zeros = n - ones

    # diferença absoluta
    diff = abs(ones - zeros)

    # proporção de 1s
    proporcao = ones / n

    print(f"Tamanho: {n}")
    print(f"1s: {ones}")
    print(f"0s: {zeros}")
    print(f"Proporção de 1s: {proporcao:.4f}")

    # critério simples (aceitável pra trabalho)
    if 0.4 <= proporcao <= 0.6:
        print("Resultado: Aprovado (sequência balanceada)\n")
        return True
    else:
        print("Resultado: Reprovado (sequência desbalanceada)\n")
        return False
    
def gerar_bits_lcg(n_bits):
    m = 2**128
    a = 6364136223846793005
    c = 1442695040888963407
    x = 12345

    bits = ""

    for _ in range(n_bits):
        x = (a * x + c) % m
        bits += str(x % 2)

    return bits


def gerar_bits_bbs(n_bits):
    p = 1000003
    q = 2001911
    M = p * q
    x = 12345

    bits = ""

    for _ in range(n_bits):
        x = (x * x) % M
        bits += str(x % 2)

    return bits

bits_lcg = gerar_bits_lcg(1000)
bits_bbs = gerar_bits_bbs(1000)

print("LCG:")
monobit_test(bits_lcg)

print("BBS:")
monobit_test(bits_bbs)