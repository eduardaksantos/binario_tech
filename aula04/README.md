# Aula 04 - Anatomia de uma Requisicao e Resposta HTTP

API de Frotas (`frota_api.js`) na **porta 3007**. Exercicios 1 a 8.

## Preparacao

~~~bash
cd ~/curso-pbe1/binario_tech/aula04
sudo apt install -y jq
npm install
~~~

**Aba 1** (deixe aberta, sem Ctrl+C):

~~~bash
node frota_api.js
~~~

**Aba 2** (todos os exercicios abaixo):

~~~bash
cd ~/curso-pbe1/binario_tech/aula04
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3007/api/v1/veiculos
~~~

Tem que imprimir `200`.

## Exercicio 01 - GET veiculo ID 1 com jq

~~~bash
curl -s http://localhost:3007/api/v1/veiculos/1 | jq
~~~

## Exercicio 02 - POST caminhao Volvo (esperado 201)

~~~bash
curl -s -w "\nStatus: %{http_code}\n" -X POST http://localhost:3007/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa": "KLL-9090", "montadora": "Volvo", "modelo": "FH 540"}'
~~~

## Exercicio 03 - POST sem placa (esperado 400)

~~~bash
curl -s -w "\nStatus: %{http_code}\n" -X POST http://localhost:3007/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Volvo", "modelo": "FH 540"}'
~~~

## Exercicio 04 - GET com filtro status=DISPONIVEL

~~~bash
curl -s "http://localhost:3007/api/v1/veiculos?status=DISPONIVEL" | jq
~~~

## Exercicio 05 - PATCH status do ID 3 para EM_ROTA

~~~bash
curl -s -X PATCH http://localhost:3007/api/v1/veiculos/3/status \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}' | jq
~~~

## Exercicio 06 - ID inexistente (esperado 404)

~~~bash
curl -s -w "\nStatus: %{http_code}\n" -X PATCH http://localhost:3007/api/v1/veiculos/99/status \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}'

curl -s -w "\nStatus: %{http_code}\n" -X DELETE http://localhost:3007/api/v1/veiculos/99
~~~

## Exercicio 07 - Rota PUT

Rota no `frota_api.js`, depois da rota DELETE e antes do `app.listen`:

~~~javascript
app.put('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { placa, montadora, modelo, status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!placa || !montadora || !modelo || !status) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora', 'modelo' e 'status' sao obrigatorios." });
    }

    veiculo.placa = placa;
    veiculo.montadora = montadora;
    veiculo.modelo = modelo;
    veiculo.status = status.toUpperCase();

    res.status(200).json({ mensagem: "Veiculo atualizado com sucesso!", veiculo });
});
~~~

Reiniciar a API (aba 1):

~~~bash
pkill -f frota_api.js
node frota_api.js
~~~

Teste (aba 2, esperado 200):

~~~bash
curl -s -w "\nStatus: %{http_code}\n" -X PUT http://localhost:3007/api/v1/veiculos/1 \
  -H "Content-Type: application/json" \
  -d '{"placa": "NEW-0001", "montadora": "Volvo", "modelo": "FH 460", "status": "EM_ROTA"}'
~~~

## Exercicio 08 - Script teste_crud.sh

Cadastra 2 veiculos, atualiza 1, deleta o outro e registra tudo em `crud_result.log`.

Criar o script:

~~~bash
cat > teste_crud.sh << 'EOF'
#!/bin/bash
# Script de teste CRUD - API de Frotas
BASE_URL="http://localhost:3007/api/v1/veiculos"
LOG_FILE="crud_result.log"

echo "=== Teste CRUD iniciado em $(date) ===" > "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 1. Cadastrando veiculo 1 (Volvo FH 540) ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "KLL-9090", "montadora": "Volvo", "modelo": "FH 540"}' >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 2. Cadastrando veiculo 2 (Iveco Daily) ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"placa": "RTM-4040", "montadora": "Iveco", "modelo": "Daily"}' >> "$LOG_FILE"

# Pega os IDs dos dois ultimos veiculos cadastrados
ID1=$(curl -s "$BASE_URL" | jq '.[-2].id')
ID2=$(curl -s "$BASE_URL" | jq '.[-1].id')

echo "" >> "$LOG_FILE"
echo "--- 3. Atualizando status do veiculo ID $ID1 para EM_ROTA ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X PATCH "$BASE_URL/$ID1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}' >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 4. Deletando veiculo ID $ID2 ---" >> "$LOG_FILE"
curl -s -w "\nStatus: %{http_code}\n" -X DELETE "$BASE_URL/$ID2" >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "--- 5. Listagem final da frota ---" >> "$LOG_FILE"
curl -s "$BASE_URL" | jq >> "$LOG_FILE"

echo "" >> "$LOG_FILE"
echo "=== Teste CRUD finalizado em $(date) ===" >> "$LOG_FILE"

echo "Testes concluidos! Veja o resultado em $LOG_FILE"
EOF
~~~

Executar e ver o log:

~~~bash
chmod +x teste_crud.sh
./teste_crud.sh
cat crud_result.log
~~~

Para um log limpo, reinicie a API antes (aba 1: `pkill -f frota_api.js` e `node frota_api.js`) e rode o script na aba 2. Os dados ficam em memoria, entao cada execucao deixa um veiculo novo na frota.

### Resultado obtido (`crud_result.log`)

~~~
--- 1. Cadastrando veiculo 1 (Volvo FH 540) ---
{"id":7,"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540","status":"DISPONIVEL"}
Status: 201

--- 2. Cadastrando veiculo 2 (Iveco Daily) ---
{"id":8,"placa":"RTM-4040","montadora":"Iveco","modelo":"Daily","status":"DISPONIVEL"}
Status: 201

--- 3. Atualizando status do veiculo ID 7 para EM_ROTA ---
{"mensagem":"Status atualizado com sucesso!","veiculo":{"id":7,"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540","status":"EM_ROTA"}}
Status: 200

--- 4. Deletando veiculo ID 8 ---
{"mensagem":"Veiculo ID 8 removido com sucesso."}
Status: 200
~~~

Na listagem final (passo 5) o ID 7 aparece e o ID 8 nao, o que confirma a atualizacao e a exclusao.

## Arquivos da entrega

- `frota_api.js`
- `teste_crud.sh`
- `crud_result.log`
- `README.md`
