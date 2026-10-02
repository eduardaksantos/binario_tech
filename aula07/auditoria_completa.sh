#!/bin/bash
# auditoria_completa.sh
# Script de automação que consulta em sequência todas as rotas ativas
# do servidor (Mercedes-Benz e Scania) e registra os resultados em
# 'auditoria.log'.

BASE_URL="http://localhost:3000"
LOG_FILE="auditoria.log"

# Cabeçalho do log (sobrescreve execuções anteriores)
{
  echo "=================================================="
  echo " AUDITORIA COMPLETA DE ROTAS - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "=================================================="
} > "$LOG_FILE"

# Função que executa uma requisição e registra o resultado no log
# Parâmetros: $1 = método HTTP, $2 = caminho da rota, $3 = descrição, $4 = corpo JSON (opcional)
consultar_rota() {
  local metodo="$1"
  local caminho="$2"
  local descricao="$3"
  local corpo="$4"

  local url="${BASE_URL}${caminho}"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  echo "" >> "$LOG_FILE"
  echo "--------------------------------------------------" >> "$LOG_FILE"
  echo "[$timestamp] $descricao" >> "$LOG_FILE"
  echo "Requisição: $metodo $url" >> "$LOG_FILE"

  local resposta status corpo_resposta

  if [ -n "$corpo" ]; then
    resposta=$(curl -s -o /tmp/auditoria_body.txt -w "%{http_code}" \
      -X "$metodo" "$url" \
      -H "Content-Type: application/json" \
      -d "$corpo")
  else
    resposta=$(curl -s -o /tmp/auditoria_body.txt -w "%{http_code}" \
      -X "$metodo" "$url")
  fi

  status="$resposta"
  corpo_resposta=$(cat /tmp/auditoria_body.txt)

  echo "Status HTTP: $status" >> "$LOG_FILE"
  echo "Resposta: $corpo_resposta" >> "$LOG_FILE"

  if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
    echo "Resultado: OK" >> "$LOG_FILE"
  else
    echo "Resultado: FALHA" >> "$LOG_FILE"
  fi

  rm -f /tmp/auditoria_body.txt
}

echo "Iniciando auditoria completa das rotas em $BASE_URL ..."

# --- Rotas da Mercedes-Benz ---
consultar_rota "GET" "/api/v1/telemetria/mercedes" "Listar frota Mercedes-Benz"
consultar_rota "GET" "/api/v1/telemetria/mercedes/1" "Buscar caminhão Mercedes-Benz por ID (1)"
consultar_rota "POST" "/api/v1/telemetria/mercedes" "Cadastrar caminhão Mercedes-Benz (VIN válido)" \
  '{"modelo":"Actros","placa":"AUD1T23","vin":"AUD123XYZ456","ano":2023,"capacidadeCargaTon":25}'
consultar_rota "POST" "/api/v1/telemetria/mercedes" "Cadastrar caminhão Mercedes-Benz (VIN inválido - teste negativo)" \
  '{"modelo":"Actros","placa":"BAD1T23","vin":"CURTO"}'

# --- Rotas da Scania ---
consultar_rota "GET" "/api/v1/telemetria/scania" "Listar telemetria Scania"
consultar_rota "POST" "/api/v1/telemetria/scania" "Registrar telemetria Scania (VIN válido)" \
  '{"modelo":"R450","vin":"AUD123XYZ456"}'
consultar_rota "POST" "/api/v1/telemetria/scania" "Registrar telemetria Scania (VIN inválido - teste negativo)" \
  '{"modelo":"R450","vin":"CURTO"}'

# --- Rota inexistente (verifica o handler 404) ---
consultar_rota "GET" "/api/v1/telemetria/inexistente" "Consultar rota inexistente (esperado 404)"

{
  echo ""
  echo "=================================================="
  echo " AUDITORIA FINALIZADA - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "=================================================="
} >> "$LOG_FILE"

echo "Auditoria concluída. Resultados salvos em '$LOG_FILE'."
