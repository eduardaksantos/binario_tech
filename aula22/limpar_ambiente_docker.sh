#!/bin/bash

VERDE='\033[0;32m'
AMARELO='\033[1;33m'
NC='\033[0m'

echo "=================================================="
echo "    LIMPEZA DE AMBIENTE DOCKER - BINÁRIO TECH"
echo "=================================================="

# 1. Containers inativos (parados ou que já terminaram)
echo -e "${AMARELO}[1/2] Removendo containers inativos...${NC}"
INATIVOS=$(docker ps -aq --filter "status=exited" --filter "status=created")

if [ -n "$INATIVOS" ]; then
  docker stop $INATIVOS 2>/dev/null
  docker rm $INATIVOS
  echo -e "${VERDE}[OK] Containers inativos removidos.${NC}"
else
  echo -e "${VERDE}[OK] Nenhum container inativo encontrado.${NC}"
fi

# 2. Imagens pendentes (dangling = sem tag, <none>)
echo -e "${AMARELO}[2/2] Removendo imagens pendentes (dangling)...${NC}"
PENDENTES=$(docker images -q --filter "dangling=true")

if [ -n "$PENDENTES" ]; then
  docker rmi $PENDENTES
  echo -e "${VERDE}[OK] Imagens pendentes removidas.${NC}"
else
  echo -e "${VERDE}[OK] Nenhuma imagem pendente encontrada.${NC}"
fi

echo "=================================================="
