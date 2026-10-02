#!/bin/bash
echo "==================================================="
echo " AUDITORIA DE PERSISTENCIA EM DISCO - BINARIO TECH "
echo "==================================================="
echo -e "\n[1] Cadastrando Ocorrência Scania..."
curl -s -X POST http://localhost:3000/api/v1/ocorrencias \
    -H "Content-Type: application/json" \
    -d '{"montadora":"Scania","placa":"MBB-1122","descricao":"Troca de pastilhas de frio", "gravidade": "BAIXA"}' | jq .

echo -e "\n[2] Consultando ocorrências via API (GET)..."
curl -s http://localhost:3000/api/v1/ocorrencias | jq .

echo -e "\n[3] Lendo arquivo JSON direto do disco (cat ocorrencias.json)..."
cat ocorrencias.json | jq .
