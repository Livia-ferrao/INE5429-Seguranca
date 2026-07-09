def mdc(a, b):
    while b != 0:
        a, b = b, a % b
    return a


def fermat(a, n):
    if n <= 1:
        return "Composto"

    if mdc(a, n) != 1:
        return "Composto"
    
    resultado = pow(a, n - 1, n)
    
    if resultado == 1:
        return "Provavelmente primo"
    else:
        return "Composto"


def miller_rabin(a, n):
    if n < 2:
        return "Composto"
    if n == 2 or n == 3:
        return "Provavelmente primo"
    if n % 2 == 0:
        return "Composto"
    if mdc(a, n) != 1:
        return "Composto"

    m = n - 1
    k = 0
    while m % 2 == 0:
        m //= 2
        k += 1

    x = pow(a, m, n)

    if x == 1 or x == n - 1:
        return "Provavelmente primo"

    for _ in range(k - 1):
        x = pow(x, 2, n)
        if x == n - 1:
            return "Provavelmente primo"

    return "Composto"


a, n = map(int, input().split())

resultado_fermat = fermat(a, n)
resultado_mr = miller_rabin(a, n)

if resultado_fermat == "Provavelmente primo" and resultado_mr == "Provavelmente primo":
    final = "provavelmente primo"
else:
    final = "composto"

print(f"Fermat {n} -> {resultado_fermat}")
print(f"Miller-Rabin {n} -> {resultado_mr}")
print(f"Resultado final: {n} é {final}")