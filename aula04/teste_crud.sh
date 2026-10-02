#!/bin/bash

# Script de teste CRUD - API de Frotas
BASE_URL="http://localhost:3000/api/v1/veiculos"
LOG_FILE="crud_result.log"

echo "=== Teste CRUD iniciado em $(date) ===" > "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 1. Cadastrando veiculo 1 (Volvo FH 540) ---" >> "$LOG_FILE"
RESPOSTA1=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "KLL-9090", "montadora": "Volvo", "modelo": "FH 540"}')
echo "$RESPOSTA1" | jq . >> "$LOG_FILE"

ID1=$(echo "$RESPOSTA1" | jq -r '.id')

echo "" >> "$LOG_FILE"
echo "--- 2. Cadastrando veiculo 2 (Iveco Daily) ---" >> "$LOG_FILE"
RESPOSTA2=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "RTM-4040", "montadora": "Iveco", "modelo": "Daily"}')
echo "$RESPOSTA2" | jq . >> "$LOG_FILE"

ID2=$(echo "$RESPOSTA2" | jq -r '.id')

echo "" >> "$LOG_FILE"
echo "--- 3. Atualizando status do veiculo ID $ID1 para EM_ROTA ---" >> "$LOG_FILE"
curl -s -X PATCH "$BASE_URL/$ID1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}' | jq . >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 4. Deletando veiculo ID $ID2 ---" >> "$LOG_FILE"
curl -s -X DELETE "$BASE_URL/$ID2" | jq . >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "=== Teste CRUD finalizado em $(date) ===" >> "$LOG_FILE"

echo "Testes concluidos! Veja o resultado em $LOG_FILE"
