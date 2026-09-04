SE_URL="http://localhost:3001"

echo "=================================================="
echo " TESTE AUTOMATICO DE SERVIDOR - BINARIO TECH "
echo " Data/Hora: $(date)"
echo "=================================================="

echo -e "\n[1] Testando Rota /status..."
echo "Horario: $(date '+%H:%M:%S')"
curl -s "${BASE_URL}/status" | jq .

echo -e "\n[2] Testando Rota /scania/info..."
echo "Horario: $(date '+%H:%M:%S')"
curl -s "${BASE_URL}/scania/info" | jq .

echo -e "\n[3] Testando Rota /vw/info..."
echo "Horario: $(date '+%H:%M:%S')"
curl -s "${BASE_URL}/vw/info" | jq .

echo -e "\n=================================================="
echo "Teste finalizado com sucesso!"
echo "=================================================="
