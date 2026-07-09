texto = """Teve$ywev$s$zivmjmgehsv$gsrwypxi
$ew$mrxvyëùiw0$oAwikvihs$EIWcGFG"""

resultado = ""

for c in texto:
    resultado += chr(ord(c) - 4)

print(resultado)

# openssl enc -d -aes-256-cbc -a -pbkdf2 -in IUVA -out IUVA.pdf -k segredo
