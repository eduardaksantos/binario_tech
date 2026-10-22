#!/bin/bash

URL="http://localhost:3007/api/v1/manutencoes"
CHAVE_VALIDA="binario-tech-secret-2026"
LOG="audit_seguranca.log"

VERDE='\033[0;32m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'
FALHAS=0

testar() {
    local n="$1" desc="$2" esperado="$3"
    shift 3
    local resposta corpo status

    resposta=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$@" "$URL")
    status=${resposta##*HTTP_STATUS:}
    corpo=${resposta%$'\n'HTTP_STATUS:*}

    {
        echo "[$(date '+%H:%M:%S')] Tentativa $n $desc:"
        echo "$corpo"
        echo "HTTP_STATUS:$status (esperado: $esperado)"
        echo ""
    } >> "$LOG"

    if [ "$status" = "$esperado" ]; then
        echo -e "${VERDE}✔ Tentativa $n $desc: HTTP $status (esperado $esperado)${SEM_COR}"
    else
        echo -e "${VERMELHO}✘ Tentativa $n $desc: HTTP $status (esperado $esperado)${SEM_COR}"
        FALHAS=$((FALHAS + 1))
    fi
}

echo "===== Auditoria iniciada em $(date '+%Y-%m-%d %H:%M:%S') =====" >> "$LOG"

# 3 tentativas SEM chave: o esperado e 401
testar 1 "SEM chave" 401
testar 2 "SEM chave" 401
testar 3 "SEM chave" 401

# 1 tentativa COM chave valida: o esperado e 200
testar 4 "COM chave valida" 200 -H "X-API-KEY: $CHAVE_VALIDA"

echo ""
if [ "$FALHAS" -eq 0 ]; then
    echo -e "${VERDE}✔ Todos os testes passaram. Log salvo em $LOG${SEM_COR}"
else
    echo -e "${VERMELHO}✘ $FALHAS teste(s) falharam. Veja $LOG${SEM_COR}"
    exit 1
fi
