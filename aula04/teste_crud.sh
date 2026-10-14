#!/bin/bash
# Script de teste CRUD - API de Frotas
BASE_URL="http://localhost:3007/api/v1/veiculos"
LOG_FILE="crud_result.log"

echo "=== Teste CRUD iniciado em $(date) ===" > "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 1. Cadastrando veiculo 1 (Volvo FH 540) ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "KLL-9090", "montadora": "Volvo", "modelo": "FH 540"}' >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 2. Cadastrando veiculo 2 (Iveco Daily) ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "RTM-4040", "montadora": "Iveco", "modelo": "Daily"}' >> "$LOG_FILE"

# Pega os IDs dos dois ultimos veiculos cadastrados
ID1=$(curl -s "$BASE_URL" | jq '.[-2].id')
ID2=$(curl -s "$BASE_URL" | jq '.[-1].id')

echo "" >> "$LOG_FILE"
echo "--- 3. Atualizando status do veiculo ID $ID1 para EM_ROTA ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X PATCH "$BASE_URL/$ID1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}' >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 4. Deletando veiculo ID $ID2 ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X DELETE "$BASE_URL/$ID2" >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 5. Listagem final da frota ---" >> "$LOG_FILE"
curl -s "$BASE_URL" | jq >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "=== Teste CRUD finalizado em $(date) ===" >> "$LOG_FILE"

echo "Testes concluidos! Veja o resultado em $LOG_FILE"
