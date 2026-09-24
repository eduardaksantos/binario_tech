Aula 03 — cURL, HTTPie, JQ, Node.js e Processos
Exercício 01 — Requisição com cURL e jq
Objetivo

Fazer uma requisição GET para a rota /api/v1/scania e exibir somente o valor do campo modelo.

Comando
curl http://localhost:3000/api/v1/scania | jq '.modelo'
Explicação
curl → realiza a requisição HTTP.
| → envia o resultado para outro comando.
jq '.modelo' → filtra e exibe apenas o campo modelo.
Exercício 02 — Requisição com HTTPie
Objetivo

Fazer uma requisição para /api/v1/mercedes utilizando HTTPie e salvar o resultado em mercedes.json.

Comando
http GET http://localhost:3000/api/v1/mercedes > mercedes.json
Explicação
http GET → realiza uma requisição GET usando HTTPie.
> → redireciona o resultado para um arquivo.
mercedes.json → arquivo onde a resposta será armazenada.
Exercício 03 — Filtrar JSON com jq
Objetivo

Ler o arquivo mercedes.json e exibir somente o valor do campo status.

Comando
jq '.status' mercedes.json
Explicação

O jq lê o arquivo JSON e .status seleciona somente o campo desejado.

Exercício 04 — Criar rota Volvo
Objetivo

Adicionar uma nova rota /api/v1/volvo no arquivo telemetria.js, retornando os dados do modelo FH 540.

Exemplo
app.get('/api/v1/volvo', (req, res) => {
    res.json({
        montadora: 'Volvo',
        modelo: 'FH 540',
        status: 'ativo'
    });
});

Depois de alterar o arquivo, reinicie a aplicação.

Testar a rota
curl http://localhost:3000/api/v1/volvo
Exercício 05 — Script start no package.json
Objetivo

Adicionar um script para iniciar a aplicação utilizando npm start.

No package.json
"scripts": {
    "start": "node telemetria.js"
}
Executar
npm start
Explicação

O npm start executa o comando definido no campo "start" do package.json.

Exercício 06 — Criar arquivo de log
Objetivo

Direcionar o resultado da auditoria do script testar_telemetria.sh para o arquivo relatorio.log.

Comando
./testar_telemetria.sh > relatorio.log
Explicação
./testar_telemetria.sh → executa o script.
> → redireciona a saída.
relatorio.log → arquivo que armazenará o resultado.
Exercício 07 — Filtrar dois campos com jq
Objetivo

Filtrar a resposta da rota /api/v1/vw, exibindo somente montadora e status.

Comando
curl http://localhost:3000/api/v1/vw | jq '{montadora, status}'
Explicação

O jq cria uma nova saída contendo apenas os dois campos selecionados.

Exercício 08 — Localizar e encerrar processo Node.js
Objetivo

Encontrar o PID do processo Node.js em execução e encerrá-lo.

1. Localizar o processo
ps aux | grep node
2. Encerrar pelo PID
kill -9 <PID>

Exemplo:

kill -9 1234
Explicação
ps aux → lista os processos em execução.
grep node → filtra os processos relacionados ao Node.js.
PID → identificador do processo.
kill -9 → força o encerramento do processo.
📌 Resumo dos principais comandos
Comando	Função
curl	Faz requisições HTTP
http GET	Faz requisições usando HTTPie
jq	Filtra e manipula JSON
>	Redireciona saída para um arquivo
npm start	Inicia a aplicação pelo script start
ps aux	Lista processos
grep	Filtra resultados
kill -9	Encerra um processo pelo PID
