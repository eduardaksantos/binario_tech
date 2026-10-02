#!/bin/bash
echo "==================================================="
echo " LIMPEZA DE AMBIENTE - BINARIO TECH "
echo "==================================================="

echo -e "\n[1] Encerrando processo Node.js (ocorrencias_api.js)..."
if pgrep -f "node ocorrencias_api.js" > /dev/null; then
    pkill -f "node ocorrencias_api.js"
    echo "Processo encerrado com sucesso."
else
    echo "Nenhum processo em execucao encontrado."
fi

echo -e "\n[2] Removendo arquivo ocorrencias.json..."
if [ -f "ocorrencias.json" ]; then
    rm ocorrencias.json
    echo "Arquivo ocorrencias.json removido com sucesso."
else
    echo "Arquivo ocorrencias.json nao encontrado (ja estava limpo)."
fi

echo -e "\n[3] Ambiente resetado. Pronto para novos testes."
echo "==================================================="
