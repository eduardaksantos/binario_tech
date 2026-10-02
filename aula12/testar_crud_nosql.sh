#!/bin/bash
echo "==================================================="
echo " AUDITORIA DE CRUD E SUBDOCUMENTOS NOSQL - AULA 12" 
echo "==================================================="

echo -e "\n[1] Registrando Manutenção com Subdocumentos de Peças..."
RESP=$(curl -s -X POST http://localhost:3000/api/v1/manutencoes\
	-H "Content-Type: application/json" \
	-d '{
	"veiculoPlaca": "SCA-2026",
	"tipoManutencao": "PREVENTIVA",
	"custoTotal": 1500.00,
	"pecasSubstituidas": [
	{ "nomePeca": "Filtro de óleo", "quantidade": 2, "custoUnitario": 150.00 },
		{ "nomePeca": "Óleo do Motor 15W40", "quantidade": 1, "custoUnitario 1200.00 }
		]
	}') 
	echo $RESP | jq . 

	ID=$(echo $RESP | jq -r '._id')

	echo -e "\n[2] Consultando manutenções com Custo Maior ou Igual a R$ 1000 ($gte)..."
	curl -s "http://localhost3000/api/v1/manutencoes?minCusto=1000" | jq . 

	echo -e "\n[3] Atalizando Status da Manutencao/$ID/status" \
		"http://localost:3000/api/v1/manutencoes/$ID/status" \
		-H "Conent-Type: application/json" \
		-d '{"status": "CONCLUIDA"}' | jq . 
