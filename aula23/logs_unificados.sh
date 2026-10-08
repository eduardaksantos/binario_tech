#!/usr/bin/env bash
# Monitora em tempo real os logs combinados dos serviços do docker-compose
# Uso: ./logs_unificados.sh            -> todos os serviços (API + Redis)
#      ./logs_unificados.sh redis      -> apenas um serviço

set -euo pipefail

# Garante que o script rode na pasta onde está o docker-compose.yml
cd "$(dirname "$0")"

trap 'echo; echo "Monitoramento encerrado."; exit 0' INT TERM

echo "=== Logs unificados (últimas 20 linhas + tempo real) ==="
echo "Pressione Ctrl+C para sair."
echo

docker compose logs -f --tail=20 "$@"
