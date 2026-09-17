#!/bin/bash

# =========================================================
# TESTAR PROVA - AULA 18
# Cadastro, Login e Acesso a Rota Protegida (JWT)
# =========================================================

BASE_URL="http://localhost:3007/api/v1/prova"
EMAIL="usuario_teste_$(date +%s)@teste.com"
SENHA="123456"

echo "========================================================="
echo " TESTE AUTOMATIZADO - CADASTRO / LOGIN / ROTA PROTEGIDA"
echo "========================================================="

# 1. Cadastrar usuário
echo -e "\n[1] Cadastrando usuário ($EMAIL)..."
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{ \"email\": \"$EMAIL\", \"senha\": \"$SENHA\" }" | jq .

# 2. Fazer login e guardar o token em uma variável
echo -e "\n[2] Realizando login..."
RESPOSTA_LOGIN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{ \"email\": \"$EMAIL\", \"senha\": \"$SENHA\" }")

echo "$RESPOSTA_LOGIN" | jq .

TOKEN=$(echo "$RESPOSTA_LOGIN" | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo -e "\n❌ Falha ao obter o token. Abortando."
  exit 1
fi

echo -e "\nToken obtido: $TOKEN"

# 3. Acessar a rota protegida usando o token
echo -e "\n[3] Acessando rota protegida (/relatorio)..."
curl -s -X GET "$BASE_URL/relatorio" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n========================================================="
echo " TESTE FINALIZADO"
echo "========================================================="
