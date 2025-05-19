import sys
import json
import sys

# Entradas desde Node.js
infectados = int(sys.argv[1])
tiempoCurarse = int(sys.argv[2])
poblacion = int(sys.argv[3])
contagios_por_dia = int(sys.argv[4])

# Parámetros iniciales
N = poblacion
I = infectados
R = 0
S = N - I

dias = 30

# Parámetros del modelo
beta = contagios_por_dia / N   # tasa de transmisión
gamma = 1 / tiempoCurarse      # tasa de recuperación

# Guardamos valores absolutos
result_S = []
result_I = []
result_R = []
eje_tiempo = []

for t in range(dias + 1):
    # Guardamos el tiempo
    eje_tiempo.append(t)

    # Guardamos los valores actuales
    result_S.append(S)
    result_I.append(I)
    result_R.append(R)

    # Derivadas (tasas de cambio)
    dS = -beta * S * I
    dI = beta * S * I - gamma * I
    dR = gamma * I

    # Actualizamos los valores de S, I, R
    S += dS
    I += dI
    R += dR

result_S_pct = [s / N * 100 for s in result_S]
result_I_pct = [i / N * 100 for i in result_I]
result_R_pct = [r / N * 100 for r in result_R]

dia_final = next((i for i, val in enumerate(result_I) if val < 1), len(result_I) - 1)

resultado = {
    "dias": eje_tiempo,
    "S": result_S,
    "I": result_I,
    "R": result_R,
    "S_pct": result_S_pct,
    "I_pct": result_I_pct,
    "R_pct": result_R_pct,
    "dia_final" : dia_final
}


print(json.dumps(resultado))
