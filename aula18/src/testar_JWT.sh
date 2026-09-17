#!/bin/bash
echo "===================================================="
echo " AUDITORIA DE AUTENTICAÇÃO JWT - AULA 18"
echo "===================================================="

echo -e "\n[1] Registrando novo Usuário..."
curl -s -X POST http://localhost:3007/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "operador@binariotech.com.br", "senha": "SenhaSegura123!" }' | jq .

echo -e "\n[2] Realizando Login e obtendo JWT..."
LOGIN_RESP=$(curl -s -X POST http://localhost:3007/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "operador@binariotech.com.br", "senha": "SenhaSegura123!" }')

echo $LOGIN_RESP | jq .

TOKEN=$(echo $LOGIN_RESP | jq -r '.token')

echo -e "\n[3] Tentando acessar Rota Protegida SEM Token (Esperado HTTP 401)..."
curl -s http://localhost:3007/api/v1/simulado/status | jq .

echo -e "\n[4] Acessando Rota Protegida COM Token JWT Válido (Esperado HTTP 200)..."
curl -s http://localhost:3007/api/v1/simulado/status \
  -H "Authorization: Bearer $TOKEN" | jq .
