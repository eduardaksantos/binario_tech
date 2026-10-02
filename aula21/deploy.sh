#!/bin/bash
echo "=================================================="
echo "    PIPELINE DE DEPLOY AUTOMATIZADO - BINÁRIO TECH"
echo "=================================================="

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$APP_DIR/.." && pwd)"
APP_NAME="api-cicd"
PORT=3007

echo "[1/4] Atualizando código-fonte do repositório remoto..."
cd "$REPO_DIR"
git pull --no-rebase origin main || echo "Aviso: pull ignorado"
COMMIT_HASH=$(git rev-parse --short HEAD)

echo "[2/4] Verificando e instalando novas dependências..."
cd "$APP_DIR"
npm install --omit=dev

echo "[3/4] Reiniciando aplicação no PM2..."
pm2 restart $APP_NAME || pm2 start server.js --name $APP_NAME

echo "[4/4] Executando Smoke Test na API (Porta $PORT)..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/v1/versao)

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "\n[SUCESSO] Deploy verificado! HTTP Status 200."
  pm2 list | grep $APP_NAME
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy com sucesso - Commit: $COMMIT_HASH" >> "$APP_DIR/deploy_history.log"
else
  echo -e "\n[FALHA] Smoke Test falhou com status $HTTP_STATUS!"
  pm2 logs $APP_NAME --lines 20 --nostream
  exit 1
fi
echo "=================================================="
