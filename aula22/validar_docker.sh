#!/bin/bash

VERDE='\033[0;32m'
VERMELHO='\033[0;31m'
NC='\033[0m'

echo "=================================================="
echo "    AUDITORIA DE CONTAINER DOCKER - BINÁRIO TECH"
echo "=================================================="

for NOME in container-telemetria container-telemetria-hml; do
  if [ "$(docker inspect -f '{{.State.Running}}' "$NOME" 2>/dev/null)" = "true" ]; then
    echo -e "${VERDE}[OK] Container '$NOME' está rodando.${NC}"
  else
    echo -e "${VERMELHO}[ERRO] Container '$NOME' não está rodando.${NC}"
  fi
done

echo "=================================================="
