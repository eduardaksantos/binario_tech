#!/bin/bash

LOG_FILE="audit_seguranca.log"
URL="http://localhost:3000/api/v1/motoristas"
CHAVE_VALIDA="binario-tech-secret-2026"

echo "===== Auditoria de Seguranca - $(date) =====" > "$LOG_FILE"
echo "" >> "$LOG_FILE"

for i in 1 2 3
do
    echo "--- Tentativa $i (SEM chave de API) ---" >> "$LOG_FILE"
    curl -s -i "$URL" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
done

echo "--- Tentativa 4 (COM chave de API valida) ---" >> "$LOG_FILE"
curl -s -i -H "x-api-key: $CHAVE_VALIDA" "$URL" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "===== Fim da Auditoria =====" >> "$LOG_FILE"

echo "Testes concluidos. Resultados salvos em $LOG_FILE"
