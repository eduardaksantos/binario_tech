#!/bin/bash
echo "======================================================"
echo " AUDITORIA DE RELACIONAMENTOS (JOIN) - BINÁRIO TECH"
echo "======================================================"

echo -e "[1] Cadastrando Veículo Scania..."
curl -s -X POST http://localhost3000/api/v1/telemetria/veiculo-teste \
	-H "Content-Type: application/json" \
	-d '{placa":"SCA-900, "montadora":"Scania","modelo":R450"}' | jq . 
