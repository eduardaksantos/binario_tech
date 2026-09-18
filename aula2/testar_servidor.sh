#!/bin/bash

echo "=========================================="
echo "      TESTANDO ROTAS DO SERVIDOR         "
echo "=========================================="

echo -e "\n[$(date +'%H:%M:%S')] 1. Testando rota /status:"
curl -s http://localhost:3007/status

echo -e "\n\n[$(date +'%H:%M:%S')] 2. Testando rota /scania/info:"
curl -s http://localhost:3007/scania/info

echo -e "\n\n[$(date +'%H:%M:%S')] 3. Testando rota /vw/info:"
curl -s http://localhost:3007/vw/info

echo -e "\n\n=========================================="
echo "          TESTE FINALIZADO               "
echo "=========================================="
