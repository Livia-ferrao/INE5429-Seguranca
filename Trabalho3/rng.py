def gerar_lcg(n_bits):
    m = 2147483648
    a = 1103515245
    c = 12345
    x = 12345

    bits = ""

    for _ in range(n_bits):
        x = (a * x + c) % m
        bit = x % 2
        bits += str(bit)

    return int(bits, 2)


def gerar_bbs(n_bits):
    p = 499
    q = 503
    M = p * q
    x = 12345

    bits = ""

    for _ in range(n_bits):
        x = (x * x) % M
        bit = x % 2
        bits += str(bit)

    return int(bits, 2)


n = int(input())

resultado_lcg = gerar_lcg(n)
resultado_bbs = gerar_bbs(n)

print(f"LCG -> {resultado_lcg}")
print(f"BBS -> {resultado_bbs}")