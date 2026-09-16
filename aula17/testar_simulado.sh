#!/bin/bash

# Exercício 1: Testar a rota /api/v1/health e registrar o HTTP Status Code

URL="http://localhost:3007/api/v1/health"
LOG_FILE="health_check.log"

# Faz a requisição GET e captura apenas o HTTP Status Code
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

# Grava o status code no arquivo de log, junto com a data/hora do teste
echo "$(date '+%Y-%m-%d %H:%M:%S') - Status Code: $STATUS_CODE" >> "$LOG_FILE"

echo "Requisição realizada para $URL"
echo "HTTP Status Code: $STATUS_CODE"
echo "Resultado salvo em $LOG_FILE"
