README — Aula 04: CRUD e API REST
 Antes de começar

Antes de executar os exercícios, inicie a API.

Se o package.json tiver:

"scripts": {
    "start": "node telemetria.js"
}

execute:

npm start

Se estiver funcionando, o terminal deverá indicar que o servidor está rodando, por exemplo:

Servidor rodando na porta 3000

Deixe esse terminal aberto.
Abra outro terminal para executar os exercícios.

Se aparecer Couldn't connect to server, significa que a API não está rodando na porta 3000. Nesse caso, execute npm start antes do curl.

Exercício 01 — GET por ID

Objetivo: Buscar somente o veículo de ID 1 e formatar o resultado com jq.

curl http://localhost:3000/api/v1/veiculos/1 | jq
curl → faz a requisição.
/veiculos/1 → busca o veículo de ID 1.
| → envia o resultado para o próximo comando.
jq → formata o JSON.
⚠️ Se aparecer:
curl: (7) Failed to connect to localhost port 3000

A API não está rodando. Execute:

npm start
Exercício 02 — POST

Objetivo: Cadastrar um novo caminhão Volvo.

curl -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"montadora":"Volvo","modelo":"FH 540","placa":"KLL-9090"}'

Esperado:

201 Created
POST → cria um veículo.
-H → define o tipo do conteúdo.
-d → envia os dados.
201 → recurso criado com sucesso.
Exercício 03 — POST sem placa

Objetivo: Testar uma requisição inválida.

curl -X POST http://localhost:3000/api/v1/veiculos \
-H "Content-Type: application/json" \
-d '{"montadora":"Volvo","modelo":"FH 540"}'

Esperado:

400 Bad Request

A API deve informar que a placa é obrigatória.

400 → requisição inválida.
Exercício 04 — GET com Query Param

Objetivo: Filtrar veículos pelo status.

curl "http://localhost:3000/api/v1/veiculos?status=DISPONIVEL" | jq
? → inicia o parâmetro.
status=DISPONIVEL → filtra os veículos disponíveis.
Estrutura:
URL?parametro=valor
Exercício 05 — PATCH

Objetivo: Alterar o status do veículo de ID 3.

curl -X PATCH http://localhost:3000/api/v1/veiculos/3 \
-H "Content-Type: application/json" \
-d '{"status":"EM_ROTA"}'
PATCH → altera apenas parte dos dados.
/3 → veículo de ID 3.
Exercício 06 — ID inexistente

Objetivo: Testar um veículo que não existe.

curl -X PATCH http://localhost:3000/api/v1/veiculos/99 \
-H "Content-Type: application/json" \
-d '{"status":"EM_ROTA"}'

Ou:

curl -X DELETE http://localhost:3000/api/v1/veiculos/99

Esperado:

404 Not Found
404 → recurso não encontrado.
Exercício 07 — PUT

Objetivo: Criar uma rota para substituir todos os dados de um veículo.

No telemetria.js:

app.put('/api/v1/veiculos/:id', (req, res) => {
    // lógica para substituir o veículo
});

Exemplo de requisição:

curl -X PUT http://localhost:3000/api/v1/veiculos/1 \
-H "Content-Type: application/json" \
-d '{"montadora":"Volvo","modelo":"FH 540","placa":"ABC-1234","status":"DISPONIVEL"}'
PUT → substitui todos os dados.
:id → representa o ID do veículo.
Exercício 08 — Script Bash

Objetivo: Criar um script que faça o CRUD e registre os resultados.

Criar:

nano teste_crud.sh

Dar permissão:

chmod +x teste_crud.sh

Executar:

./teste_crud.sh

Visualizar o log:

cat crud_result.log
chmod +x → permite executar o script.
./teste_crud.sh → executa o script.
crud_result.log → armazena os resultados.
Comandos principais para a prova

Iniciar a API
npm start

GET
curl http://localhost:3000/api/v1/veiculos/1 | jq

POST
curl -X POST URL -H "Content-Type: application/json" -d 'JSON'

PATCH
curl -X PATCH URL -H "Content-Type: application/json" -d 'JSON'

PUT
curl -X PUT URL -H "Content-Type: application/json" -d 'JSON'

DELETE
curl -X DELETE URL

Filtrar JSON
jq '.campo'

Ver processos
ps aux | grep node

Encerrar processo
kill -9 <PID>

🧠 CRUD para decorar
Método  Função

GET Buscar

POST    Criar

PATCH   Alterar parcialmente

PUT Substituir

DELETE  Excluir
