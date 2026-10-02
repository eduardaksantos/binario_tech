# Binário Tech

Projeto desenvolvido ao longo das aulas da disciplina de Programação Back-End, com APIs em Node.js/Express, scripts de terminal (Shell) e bancos de dados SQLite e MongoDB.

Este README tem duas partes:

1. **Alterações realizadas no projeto** (a base que já existia).
2. **Guia de estudo — passo a passo de cada aula**, com a resolução de todos os exercícios propostos pelo professor, pensado para revisão rápida antes da prova surpresa (o professor pode pedir para refazer qualquer aula, então cada seção aqui é auto-suficiente: o que foi pedido, como resolver, e o resultado esperado).

> Sempre que o exercício já estava resolvido no seu código, isso está marcado com **✅ já no código**, com uma nota curta sobre onde e como foi feito — sem repetir o exercício inteiro.
> Sempre que encontrei uma diferença entre o que está no ZIP e o que o exercício pede (rota que não bate, campo que não existe na tabela, etc.), isso está marcado com **⚠️ atenção** e vem com a correção pronta para copiar.

---

## Sumário

- [1. Alterações realizadas](#1-alterações-realizadas)
- [2. Como executar](#2-como-executar)
- [3. Referência rápida (usar durante a prova)](#3-referência-rápida-usar-durante-a-prova)
- [4. Guia passo a passo por aula](#4-guia-passo-a-passo-por-aula)
  - [Aula 01 — Fundamentos de Terminal Linux e Node.js](#aula-01--fundamentos-de-terminal-linux-e-nodejs)
  - [Aula 02 — Primeira API REST com Express](#aula-02--primeira-api-rest-com-express)
  - [Aula 03 — Múltiplos servidores e portas](#aula-03--múltiplos-servidores-e-portas)
  - [Aula 04 — CRUD completo em memória](#aula-04--crud-completo-em-memória)
  - [Aula 05 — Middlewares e segurança básica](#aula-05--middlewares-e-segurança-básica)
  - [Aula 06 — Persistência em arquivo JSON](#aula-06--persistência-em-arquivo-json)
  - [Aula 07 — Arquitetura em camadas (MVC) e roteamento avançado](#aula-07--arquitetura-em-camadas-mvc-e-roteamento-avançado)
  - [Aula 08 — SQLite3 + Knex.js e migrations](#aula-08--sqlite3--knexjs-e-migrations)
  - [Aula 09 — Relacionamentos, Foreign Keys e Joins](#aula-09--relacionamentos-foreign-keys-e-joins)
  - [Aula 10 — Validação, tratamento de erros e Seeds](#aula-10--validação-tratamento-de-erros-e-seeds)
  - [Aula 11 — MongoDB e Mongoose](#aula-11--mongodb-e-mongoose)
  - [Aula 12 — CRUD completo NoSQL](#aula-12--crud-completo-nosql)
  - [Aula 13 — Express-Validator e HTTP Status Codes](#aula-13--express-validator-e-http-status-codes)
  - [Aula 14 — JWT, Bcrypt e Autorização](#aula-14--jwt-bcrypt-e-autorização)
  - [Aula 15](#aula-15)
  - [Aula 16 — Processos, PIDs e portas em uso](#aula-16--processos-pids-e-portas-em-uso)
  - [Aula 17 — Revisão geral e checklist de avaliação](#aula-17--revisão-geral-e-checklist-de-avaliação)
  - [Aula 18 — Avaliação prática intermediária](#aula-18--avaliação-prática-intermediária)
  - [Aula 19 — PM2 e gerenciamento de processos](#aula-19--pm2-e-gerenciamento-de-processos)
  - [Aula 20 — Proxy Reverso com Nginx](#aula-20--proxy-reverso-com-nginx)
  - [Aula 21 — CI/CD Local e Automação de Deploy](#aula-21--cicd-local-e-automação-de-deploy)
- [5. Observações finais para a prova](#5-observações-finais-para-a-prova)

---

## 1. Alterações realizadas

### 1.1 Mudança da porta: 3000 → 3013

O projeto foi originalmente desenvolvido no Google Cloud Shell, usando a porta padrão 3000. Com a migração para execução no terminal local, cada aluno passou a utilizar uma porta individual correspondente ao seu número de chamada. Neste projeto, a porta utilizada é a **3013**.

A alteração foi aplicada em:

| Tipo de arquivo | Aulas afetadas |
|---|---|
| Servidores (`server.js`, `servidor.js`, `app.js`, `frota_api.js`, `ocorrencias_api.js`) | 02, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 16, 19 |
| Variáveis de ambiente (`.env`) | 11, 12, 14, 18, 19 |
| Scripts de teste (`testar_*.sh`, `teste_*.sh`, `auditoria_*.sh`, `limpar_dados.sh`) | 02, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14 |

**Exceção:** a aula 03 (`telemetria.js`) utiliza a porta **3001**. Essa porta foi definida propositalmente desde o início para permitir que o servidor de telemetria rodasse em paralelo ao servidor principal, portanto não foi alterada.

**Exceção 2:** a aula 19 usa duas portas de propósito — **3013** para o processo de desenvolvimento (`api-telemetria-dev`, no `ecosystem.config.js`) e **8013** para o processo de produção em cluster (`api-telemetria-prod`), para não haver conflito entre os dois processos rodando ao mesmo tempo no PM2.

**Exceção 3:** a aula 20 usa a porta **3013** para a API interna do Node (por trás do Nginx, a porta do seu número de chamada) e a **8080** pra acessar via proxy reverso — de propósito, é o ponto central da aula (o Nginx escuta na 8080 e repassa pra 3013). A aula 21 também usa a **3013** (a porta do seu número de chamada), mas nunca junto com a aula 20 no PM2: pare uma antes de subir a outra.

### 1.2 Padronização dos nomes de arquivos

Alguns arquivos de atividade estavam com o nome corrompido por diferença de codificação entre sistemas (ex.: `FIXA#U00c7#U00c3O` em vez de `FIXAÇÃO`), o que causava erros ao copiar e ao versionar no Git.

Os nomes foram padronizados removendo acentos e caracteres especiais (ç, ã, õ, |, :), já que esses símbolos têm significado próprio no terminal e geram problemas de compatibilidade.

Exemplo:

```
Antes:  Aula 14: Autentica#U00e7#U00e3o Stateless com JWT (JSON Web Token)...
Depois: Aula 14 - Autenticacao Stateless com JWT (JSON Web Token)...
```

## 2. Como executar

Cada aula é um projeto independente. Para rodar qualquer uma delas:

```bash
cd aula0X            # substitua X pelo número da aula
npm install          # instala as dependências
node server.js       # o nome do arquivo varia conforme a aula
```

O servidor ficará disponível em `http://localhost:3013` (salvo as exceções da seção 1.1).

Para executar os testes automatizados da aula (quando houver):

```bash
bash testar_*.sh
```

### Observação sobre as aulas 11, 12, 17 e 18

Essas aulas utilizam MongoDB e exigem que o banco esteja rodando localmente em `127.0.0.1:27017` antes de iniciar o servidor. As demais aulas que usam banco de dados (08, 09, 10) utilizam SQLite, que é embarcado e não exige instalação de servidor adicional. Para isso, sempre que for usado o mongoose, rode o comando:

```bash
docker run -d -p 27017:27017 --name mongo-simulado mongo:latest
```

(padrão utilizado na aula 17.)

Comandos para o mongo:

```bash
docker ps                      # ver se ele está rodando
docker stop mongo-simulado     # parar o banco de dados
docker start mongo-simulado    # ligar de novo (sem precisar recriar)
docker rm -f mongo-simulado    # apagar o container
```

### Tecnologias utilizadas

- Node.js + Express
- Shell Script (Bash)
- SQLite3 + Knex.js (aulas 08 a 10)
- MongoDB + Mongoose (aulas 11, 12, 17 e 18)
- JWT + Bcrypt (aula 14, 18)
- Express-Validator (aula 13)
- PM2 (aula 19)

## 3. Referência rápida (usar durante a prova)

### 3.1 Checklist antes de começar qualquer aula na prova

1. `cd aulaXX && ls` — conferir o nome real do arquivo do servidor (varia: `server.js`, `servidor.js`, `app.js`, `frota_api.js`, `ocorrencias_api.js`).
2. `npm install` — se a pasta não tiver `node_modules`.
3. Se a aula usa Knex/SQLite (08, 09, 10): rodar as migrations antes de subir o servidor (`npx knex migrate:latest`, e `npx knex seed:run` se houver seeds).
4. Se a aula usa Mongoose (11, 12, 17, 18): confirmar que o Mongo está rodando (`docker ps`) antes de dar `node server.js`, senão a conexão trava/derruba a aplicação.
5. Conferir a porta certa no `.env` ou no topo do arquivo do servidor (padrão **3013**, exceto aula 03 = 3001 e aula 19-prod = 8013).
6. Testar com `curl` antes de sair mexendo no código — muitas vezes o servidor já está certo e só falta subir o banco.

### 3.2 Tabela de HTTP Status Codes usados no projeto

| Código | Nome | Quando usar |
|---|---|---|
| 200 | OK | Requisição bem-sucedida (GET, PUT, PATCH que retornam dado) |
| 201 | Created | Recurso criado com sucesso (POST) |
| 204 | No Content | Exclusão com sucesso, sem corpo de resposta (DELETE) |
| 400 | Bad Request | JSON malformado, Content-Type errado, corpo ausente |
| 401 | Unauthorized | Token JWT ausente ou inválido |
| 403 | Forbidden | Token válido, mas sem permissão para o recurso (perfil errado) |
| 404 | Not Found | Rota ou recurso (id) que não existe |
| 409 | Conflict | Violação de dado único (placa/VIN/e-mail duplicado) |
| 422 | Unprocessable Entity | Corpo bem formado, mas os dados não passam na validação (express-validator) |
| 500 | Internal Server Error | Erro inesperado/não tratado no servidor |

### 3.3 Comandos que aparecem em quase toda aula

```bash
# Testar uma rota GET formatando a resposta
curl -s http://localhost:3013/api/v1/rota | jq .

# Testar uma rota POST com corpo JSON
curl -s -X POST http://localhost:3013/api/v1/rota \
  -H "Content-Type: application/json" \
  -d '{"campo":"valor"}' | jq .

# Ver só o status code de uma resposta
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3013/api/v1/rota

# Ver status code + corpo ao mesmo tempo
curl -s -i http://localhost:3013/api/v1/rota

# PUT / PATCH / DELETE
curl -s -X PUT    http://localhost:3013/api/v1/rota/1 -H "Content-Type: application/json" -d '{"campo":"novo"}'
curl -s -X DELETE http://localhost:3013/api/v1/rota/1 -w " -> %{http_code}\n"

# Rota autenticada (JWT)
curl -s http://localhost:3013/api/v1/rota-protegida -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Git básico
git status
git add .
git commit -m "mensagem"
git push origin main
```

### 3.4 Ordem típica de uma API em camadas (usada a partir da aula 07)

```
requisição → routes → middlewares (validação/auth) → controller → banco (Knex/Mongoose) → resposta
```

---

## 4. Guia passo a passo por aula

### Aula 01 — Fundamentos de Terminal Linux e Node.js

**Contexto:** primeiro contato com o Google Cloud Shell / Terminal Linux, comandos de verificação de ambiente e primeira requisição HTTP via `curl`.

**Preparação (se pedir para verificar o ambiente):**

```bash
uname -a            # versão do sistema operacional Linux
node -v              # versão do Node.js instalada
python3 --version
curl --version
mkdir binario_tech && cd binario_tech && pwd
curl -s https://api.github.com/users/octocat   # exemplo de requisição HTTP simples
```

**Exercício 1 — Criar `dev.json` com o `nano`**

```bash
nano dev.json
```

Conteúdo:

```json
{
  "nome": "Seu Nome Completo",
  "cargo": "Desenvolvedor Jr",
  "montadora_favorita": "Scania",
  "status": "Ativo"
}
```

✅ **já no código** — `dev.json` está na raiz do projeto, preenchido corretamente.

**Exercício 2 — Ver o conteúdo do arquivo**

```bash
cat dev.json
```

**Exercício 3 — Contar as linhas do arquivo**

```bash
wc -l dev.json
```

Resultado esperado: o `dev.json` do projeto tem 6 linhas (chaves de abertura/fechamento + 4 campos).

---

### Aula 02 — Primeira API REST com Express

**Preparação:**

```bash
cd ~/binario_tech && mkdir aula02 && cd aula02
npm init -y
npm install express
sudo apt-get update && sudo apt-get install -y jq httpie
```

`servidor.js` base entregue pelo professor (porta trocada de 3000 para **3013**, conforme seção 1.1):

```js
const express = require('express');
const app = express();
const PORT = 3013;

app.use(express.json());

app.get('/status', (req, res) => {
  res.json({
    servidor: "Binario Tech Core",
    status: "OPERACIONAL",
    montadoras_atendidas: ["Scania", "Mercedes", "VW"],
    uptime_segundos: process.uptime()
  });
});

app.get('/scania/info', (req, res) => {
  res.json({
    montadora: "Scania",
    foco: "Caminhoes Pesados e Ônibus",
    sistema_telemetria: "Ativo",
    unidades_conectadas: 1420
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
```

Rodar em segundo plano e testar:

```bash
node servidor.js &
curl -s http://localhost:3013/status
http http://localhost:3013/status
curl -s http://localhost:3013/status | jq .
```

✅ **já no código** — `servidor.js` está completo, incluindo a rota `/vw/info` do exercício 14.

#### Grupo A — Ambiente, processos e comandos básicos

| # | O que fazer | Comando |
|---|---|---|
| 1 | Diretório atual + listagem completa | `pwd` e `ls -la` |
| 2 | Filtrar variáveis de ambiente com `USER` ou `SHELL` | `env \| grep -E 'USER\|SHELL'` |
| 3 | PID do processo do servidor | `ps aux \| grep "node servidor.js"` |
| 4 | Confirmar que a porta 3013 está escutando | `netstat -tuln` ou `ss -tuln` (procurar `:3013` com `LISTEN`) |
| 5 | Gravar data + hostname + memória em arquivo | `{ date; hostname; free -h; } > ambiente_info.txt` |

✅ **já no código** — `ambiente_info.txt` está gerado na pasta.

#### Grupo B — Dependências e pacotes

| # | O que fazer | Comando |
|---|---|---|
| 6 | Conferir `express` no `package.json` | `cat package.json` |
| 7 | Instalar `nodemon` como dev dependency | `npm install -D nodemon` → aparece em `"devDependencies"` |
| 8 | Extrair só o campo `dependencies` com `jq` | `cat package.json \| jq .dependencies` |
| 9 | Criar script `"check"` que roda `node -v` | no `package.json`: `"scripts": { "check": "node -v" }` → testar com `npm run check` |
| 10 | Instalar um pacote global e achar o binário | `npm install -g http-server` e depois `which http-server` |

✅ **já no código** — `package.json` tem `express`, `nodemon` em devDependencies e o script `"check": "node -v"`.

#### Grupo C — Requisições e manipulação de JSON

**Exercício 11 — GET salvando em arquivo**
```bash
curl -s http://localhost:3013/scania/info > scania.json
```
✅ **já no código** — `scania.json` presente com o conteúdo da rota.

**Exercício 12 — mesma requisição com httpie**
```bash
http GET http://localhost:3013/scania/info
```

**Exercício 13 — extrair um campo específico com `jq`**
```bash
cat scania.json | jq '.sistema_telemetria'
```
Resultado esperado: `"Ativo"`.

**Exercício 14 — nova rota `/vw/info`**

Adicionar dentro de `servidor.js`, logo depois da rota `/scania/info` e antes do `app.listen`:

```js
// ------- CÓDIGO ANTIGO (já existe) -------
app.get('/scania/info', (req, res) => {
  res.json({
    montadora: "Scania",
    foco: "Caminhoes Pesados e Ônibus",
    sistema_telemetria: "Ativo",
    unidades_conectadas: 1420
  });
});

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.get('/vw/info', (req, res) => {
  res.json({
    montadora: 'Volkswagen',
    sistema_telemetria: 'Ativo'
  });
});

// ------- CÓDIGO ANTIGO (continua abaixo) -------
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
```

Reiniciar o processo e testar (não mexe em nada dos exercícios anteriores, é só uma rota nova):
```bash
curl -s http://localhost:3013/vw/info | jq .
```

**Exercício 15 — script `testar_servidor.sh`**

```bash
chmod +x testar_servidor.sh
bash testar_servidor.sh
```

✅ **já no código** — `testar_servidor.sh` testa `/status`, `/scania/info` e `/vw/info`, imprimindo a data/hora antes de cada chamada.

---

### Aula 03 — Múltiplos servidores e portas

> Esta é a exceção da porta: `telemetria.js` roda na **3001**, propositalmente, para funcionar em paralelo ao servidor principal (3013). Não mexer nessa porta.

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula03 && cd aula03
npm init -y
npm install express
sudo apt-get update && sudo apt-get install -y jq httpie
```

`telemetria.js`:

```js
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/v1/scania', (req, res) => {
  res.json({ montadora: "Scania", modelo: "R450", status: "OK", conexao: true, velocidade_media: 82 });
});
app.get('/api/v1/mercedes', (req, res) => {
  res.json({ montadora: "Mercedes-Benz", modelo: "Actros", status: "OK", conexao: true, velocidade_media: 78 });
});
app.get('/api/v1/vw', (req, res) => {
  res.json({ montadora: "Volkswagen", modelo: "Delivery", status: "ALERTA", conexao: false, velocidade_media: 0 });
});

app.listen(PORT, () => {
  console.log(`[Binario Tech] Servidor de Telemetria rodando em http://localhost:${PORT}`);
});
```

```bash
node telemetria.js &
```

✅ **já no código** — inclui também a rota `/api/v1/volvo` do exercício 4.

**Exercício 1 — filtrar `modelo` com jq**
```bash
curl -s http://localhost:3001/api/v1/scania | jq '.modelo'
```

**Exercício 2 — httpie salvando em arquivo**
```bash
http GET http://localhost:3001/api/v1/mercedes > mercedes.json
```
✅ **já no código** — `mercedes.json` presente.

**Exercício 3 — extrair `status` do arquivo salvo**
```bash
jq '.status' mercedes.json
```
Resultado esperado: `"OK"`.

**Exercício 4 — nova rota `/api/v1/volvo`**

Adicionar dentro de `telemetria.js`, depois das rotas existentes e antes do `app.listen`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
app.get('/api/v1/vw', (req, res) => {
  res.json({ montadora: "Volkswagen", modelo: "Delivery", status: "ALERTA", conexao: false, velocidade_media: 0 });
});

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.get('/api/v1/volvo', (req, res) => {
  res.json({ montadora: "Volvo", modelo: "FH 540", status: "OK", conexao: true, velocidade_media: 80 });
});

// ------- CÓDIGO ANTIGO (continua abaixo) -------
app.listen(PORT, () => {
  console.log(`[Binario Tech] Servidor de Telemetria rodando em http://localhost:${PORT}`);
});
```
Reiniciar o processo e testar (rota isolada, não mexe nas outras):
```bash
curl -s http://localhost:3001/api/v1/volvo | jq .
```
✅ **já no código.**

**Exercício 5 — script `"start"` no `package.json`**
```json
"scripts": { "start": "node telemetria.js" }
```
```bash
npm start
```
✅ **já no código.**

**Exercício 6 — redirecionar a auditoria para log**
```bash
bash testar_telemetria.sh > relatorio.log
```
✅ **já no código** — `relatorio.log` gerado.

**Exercício 7 — filtrar dois campos numa chamada só do jq**
```bash
curl -s http://localhost:3001/api/v1/vw | jq '{montadora, status}'
```
Resultado esperado: `{"montadora": "Volkswagen", "status": "ALERTA"}`.

**Exercício 8 — localizar e matar o processo**
```bash
ps aux | grep node
kill -9 <PID>
```

---

### Aula 04 — CRUD completo em memória

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula04 && cd aula04
npm init -y
npm install express
```

`frota_api.js` — array em memória `veiculos`, com rotas:

- `GET /api/v1/veiculos` (aceita `?status=`)
- `GET /api/v1/veiculos/:id`
- `POST /api/v1/veiculos`
- `PATCH /api/v1/veiculos/:id/status`
- `DELETE /api/v1/veiculos/:id`

```bash
node frota_api.js &
curl -s http://localhost:3013/api/v1/veiculos | jq .
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" -d '{"placa":"VWX-5555","montadora":"Volkswagen","modelo":"Delivery"}' | jq .
curl -s -X PATCH http://localhost:3013/api/v1/veiculos/1/status -H "Content-Type: application/json" -d '{"status":"MANUTENCAO"}' | jq .
curl -s -X DELETE http://localhost:3013/api/v1/veiculos/2 | jq .
```

✅ **já no código** — a base (GET, GET/:id, POST, PATCH, DELETE) está toda implementada.

**Exercício 1 — buscar veículo por ID**
```bash
curl -s http://localhost:3013/api/v1/veiculos/1 | jq .
```

**Exercício 2 — cadastrar Volvo FH 540 e conferir 201**
```bash
curl -i -X POST http://localhost:3013/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}'
```
Resultado esperado: cabeçalho `HTTP/1.1 201 Created`.

**Exercício 3 — cadastro sem `placa` → 400**
```bash
curl -i -X POST http://localhost:3013/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540"}'
```
Resultado esperado: `400 Bad Request` com `{"erro":"Campos 'placa', 'montadora' e 'modelo' sao obrigatorios."}`.

**Exercício 4 — filtro por query param**
```bash
curl -s "http://localhost:3013/api/v1/veiculos?status=DISPONIVEL" | jq .
```

**Exercício 5 — PATCH no ID 3**
```bash
curl -s -X PATCH http://localhost:3013/api/v1/veiculos/3/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' | jq .
```

**Exercício 6 — ID inexistente → 404**
```bash
curl -i -X DELETE http://localhost:3013/api/v1/veiculos/99
```
Resultado esperado: `404 Not Found`.

**Exercício 7 — rota PUT (substituição total)**

Adicionar dentro de `frota_api.js`, junto das outras rotas de `/api/v1/veiculos/:id` (perto do PATCH/DELETE):
```js
// ------- CÓDIGO ANTIGO (já existe, ex: a rota DELETE) -------
app.delete('/api/v1/veiculos/:id', (req, res) => {
  // ... lógica de exclusão já existente ...
});

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.put('/api/v1/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { placa, montadora, modelo, status } = req.body;
  const index = veiculos.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Veiculo nao encontrado." });
  }
  if (!placa || !montadora || !modelo) {
    return res.status(400).json({ erro: "Os campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
  }
  veiculos[index] = { id, placa, montadora, modelo, status: status ? status.toUpperCase() : veiculos[index].status };
  res.status(200).json({ mensagem: "Veiculo atualizado completamente com sucesso!", veiculo: veiculos[index] });
});
```
✅ **já no código.**

Teste isolado (cadastra um veículo novo só para esse teste, em vez de sobrescrever os IDs 1/2/3 usados nos exercícios anteriores):
```bash
NOVO=$(curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{"placa":"PUT-0001","montadora":"Scania","modelo":"P360"}')
ID=$(echo "$NOVO" | jq -r '.id')
curl -s -X PUT http://localhost:3013/api/v1/veiculos/$ID -H "Content-Type: application/json" \
  -d '{"placa":"PUT-0001","montadora":"Scania","modelo":"P360","status":"disponivel"}' | jq .
```

**Exercício 8 — script `teste_crud.sh`**

Cadastra 2 veículos, faz PATCH em um e DELETE em outro, salvando tudo em `crud_result.log`:

```bash
bash teste_crud.sh
cat crud_result.log
```
✅ **já no código.**

---

### Aula 05 — Middlewares e segurança básica

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula05/routes aula05/middlewares && cd aula05
npm init -y
npm install express cors
```

Estrutura montada: `middlewares/logger.js` (log de método/rota/status/duração), `middlewares/auth.js` (exige o header `X-API-KEY: binario-tech-secret-2026`) e `routes/motoristas.js`, unidos no `app.js` com `cors()`, `express.json()`, o logger global e um handler 404 no final.

```bash
node app.js &
curl -s http://localhost:3013/api/v1/health | jq .
curl -s http://localhost:3013/api/v1/motoristas | jq .                                   # sem chave -> 401
curl -s -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3013/api/v1/motoristas | jq .   # com chave -> 200
```

✅ **já no código** — logger, auth e a rota de motoristas com validação estão implementados.

**Exercício 1 — conferir o log da rota `/health`**
```bash
curl -s http://localhost:3013/api/v1/health | jq .
```
No terminal onde o servidor está rodando aparece uma linha assim:
```
[LOG 2026-08-07T13:12:00.000Z] GET /api/v1/health - Status: 200 (2ms)
```

**Exercício 2 — `routes/manutencoes.js`**
```js
const express = require('express');
const router = express.Router();
let manutencoes = [];

router.get('/', (req, res) => res.status(200).json(manutencoes));
router.post('/', (req, res) => {
  const { veiculo, descricao, valor } = req.body;
  if (!veiculo || !descricao || !valor) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }
  const nova = { id: manutencoes.length + 1, veiculo, descricao, valor };
  manutencoes.push(nova);
  res.status(201).json(nova);
});
module.exports = router;
```
✅ **já no código** — arquivo novo, não mexe em nada do que já existia.

Teste isolado (array próprio, `manutencoes`, separado do array de motoristas — não interfere nos outros exercícios):
```bash
curl -s -H "X-API-KEY: binario-tech-secret-2026" -X POST http://localhost:3013/api/v1/manutencoes \
  -H "Content-Type: application/json" \
  -d '{"veiculo":"SCA-0001","descricao":"Troca de oleo","valor":350}' | jq .
curl -s -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3013/api/v1/manutencoes | jq .
```

**Exercício 3 — registrar `/api/v1/manutencoes` com `authMiddleware`**

Adicionar dentro de `app.js`, junto do outro `app.use` de rota já existente:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
const motoristasRouter = require('./routes/motoristas');
app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);

// ------- CÓDIGO NOVO (adicionar aqui) -------
const manutencoesRouter = require('./routes/manutencoes');
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);
```
✅ **já no código** — a rota exige a mesma chave `X-API-KEY` das outras (mostrado no teste do exercício 2 acima).

**Exercício 4 — `middlewares/validaCnh.js`**
```js
function validaCnh(req, res, next) {
  const { cnh } = req.body;
  if (!cnh || !/^\d{11}$/.test(cnh)) {
    return res.status(400).json({ erro: "A CNH deve conter exatamente 11 dígitos numéricos." });
  }
  next();
}
module.exports = validaCnh;
```
✅ **já no código.**

**Exercício 5 — aplicar `validaCnh` no POST de motoristas e testar CNH inválida**

Dentro de `routes/motoristas.js`, importar o middleware e encadeá-lo na rota já existente:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
const express = require('express');
const router = express.Router();

// ------- CÓDIGO NOVO (adicionar) -------
const validaCnh = require('../middlewares/validaCnh');

// ------- CÓDIGO ANTIGO (a linha do POST já existia, só ganha o novo middleware no meio) -------
router.post('/', validaCnh, (req, res) => { /* ... lógica de cadastro já existente ... */ });
```
```bash
curl -i -X POST http://localhost:3013/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" -H "Content-Type: application/json" \
  -d '{"nome":"Teste","cnh":"123","categoria":"B"}'
```
Resultado esperado: `400 Bad Request`. ✅ **já no código.**

**Exercício 6 — rota inexistente → 404 padronizado**
```bash
curl -s http://localhost:3013/api/v1/clientes | jq .
```
Resultado esperado: `{"erro":"Endpoint nao encontrado no servidor Binario Tech."}`.

**Exercício 7 — script `teste_seguranca.sh`**

3 tentativas sem chave (401) + 1 tentativa com chave válida (200), tudo salvo em `audit_seguranca.log`:

```bash
bash teste_seguranca.sh
cat audit_seguranca.log
```
✅ **já no código.**

**Exercício 8 — encontrar e matar o processo**
```bash
ps aux | grep node
kill -9 <PID>
```

---

### Aula 06 — Persistência em arquivo JSON

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula06 && cd aula06
npm init -y
npm install express cors
```

`ocorrencias_api.js` usa `fs/promises` para ler/escrever `ocorrencias.json` (funções auxiliares `lerOcorrencias()` e `salvarOcorrencias()`), com `GET` e `POST` em `/api/v1/ocorrencias`.

```bash
node ocorrencias_api.js &
chmod +x testar_persistencia.sh
./testar_persistencia.sh
```

✅ **já no código** — inclui também as rotas dos exercícios 3 e 4 (filtro por montadora e DELETE por ID).

**Exercício 1 — GET via httpie**
```bash
http GET http://localhost:3013/api/v1/ocorrencias
```
Resultado esperado: um array JSON com os registros salvos em `ocorrencias.json`.

**Exercício 2 — filtrar Scania no arquivo com jq**
```bash
jq '[.[] | select(.montadora == "Scania")]' ocorrencias.json
```

**Exercício 3 — rota de filtro por montadora**

Adicionar dentro de `ocorrencias_api.js`, depois da rota `GET /api/v1/ocorrencias` já existente:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
app.get('/api/v1/ocorrencias', async (req, res) => {
  // ... lógica de listagem já existente ...
});

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.get('/api/v1/ocorrencias/montadora/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const ocorrencias = await lerOcorrencias();
    const resultado = ocorrencias.filter(o => o.montadora === nome);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar por montadora." });
  }
});
```
Teste (só leitura, não altera nada):
```bash
curl -s http://localhost:3013/api/v1/ocorrencias/montadora/Scania | jq .
```
✅ **já no código.**

**Exercício 4 — DELETE por ID**

Adicionar logo depois da rota do exercício 3:
```js
// ------- CÓDIGO ANTIGO (a rota do exercício 3, já criada) -------
app.get('/api/v1/ocorrencias/montadora/:nome', async (req, res) => { /* ... */ });

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.delete('/api/v1/ocorrencias/:id', async (req, res) => {
  const idParaRemover = Number(req.params.id);
  const ocorrencias = await lerOcorrencias();
  const existe = ocorrencias.some(o => o.id === idParaRemover);
  if (!existe) return res.status(404).json({ erro: "Ocorrencia nao encontrada." });
  await salvarOcorrencias(ocorrencias.filter(o => o.id !== idParaRemover));
  res.status(200).json({ mensagem: "Ocorrencia removida com sucesso." });
});
```
Teste isolado (cria uma ocorrência descartável só para apagar, sem mexer nas que já estavam salvas):
```bash
NOVA=$(curl -s -X POST http://localhost:3013/api/v1/ocorrencias -H "Content-Type: application/json" \
  -d '{"montadora":"TesteDelete","placa":"DEL-0001","descricao":"registro de teste"}')
ID=$(echo "$NOVA" | jq -r '.id')
curl -s -X DELETE http://localhost:3013/api/v1/ocorrencias/$ID | jq .
```
✅ **já no código.**

**Exercício 5 — script `limpar_dados.sh`**

Mata o processo do `ocorrencias_api.js` e apaga o `ocorrencias.json` para resetar o ambiente:

```bash
bash limpar_dados.sh
```
✅ **já no código.**

---

### Aula 07 — Arquitetura em camadas (MVC) e roteamento avançado

> ✅ **corrigido — o servidor desta aula não subia do jeito que veio no ZIP original.** Tinha dois bugs pequenos que travavam o `node server.js` inteiro. Já apliquei os dois no pacote `binario_tech_correcoes.zip` (testados e confirmados por mim antes de mandar). Deixei a explicação de cada um abaixo porque ajuda a entender o erro — se a prova pedir pra montar essa aula do zero, é bom saber onde é fácil escorregar.

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula07/src/controllers aula07/src/routes aula07/src/middlewares
cd aula07
npm init -y
npm install express cors
```

`server.js` centraliza CORS, `express.json()`, um logger simples e agrupa as rotas por montadora em `/api/v1/telemetria/<montadora>`, com 404 no final. `src/controllers/scaniaController.js` guarda a telemetria da Scania em memória, com `listarTelemetria` e `registrarTelemetria`. `src/routes/scaniaRoutes.js` liga o controller às rotas `GET /` e `POST /`.

**Bug 1 (já corrigido) — caminho errado do `require` em `src/routes/scaniaRoutes.js`**

O arquivo original (antes da correção) estava assim:
```js
const validaVin = require('../middleware/validaVin');   // ERRADO: pasta não existe
```
Só que a pasta real é `src/middlewares` (com "s"). Isso derrubava o `node server.js` com `Cannot find module '../middleware/validaVin'` assim que o servidor tentava subir. A correção (já aplicada no `binario_tech_correcoes.zip`):
```js
const validaVin = require('../middlewares/validaVin');  // CERTO
```

**Bug 2 (já corrigido) — `mercedesRoutes.js` sem `module.exports`**

O arquivo original terminava assim, sem a última linha:
```js
const express = require('express');
const router = express.Router();
const mercedesController = require('../controllers/mercedesController');

router.get('/', mercedesController.listarTelemetria);
router.post('/', mercedesController.registrarTelemetria);
// faltava: module.exports = router;
```
Sem isso, `require('./src/routes/mercedesRoutes')` no `server.js` retornava um objeto vazio, e a rota `/api/v1/telemetria/mercedes` nunca ficava de pé (caía sempre no 404 genérico). A correção (já aplicada) — a linha adicionada no final do arquivo:
```js
module.exports = router;
```

Com os dois arquivos já corrigidos, o servidor sobe normalmente:

```bash
node server.js &
curl -s http://localhost:3013/api/v1/telemetria/scania | jq .
curl -s http://localhost:3013/api/v1/telemetria/mercedes | jq .
```

**Exercício 1 — `mercedesController.js` + `mercedesRoutes.js`**

✅ **já no código** (com o Bug 2 acima corrigido) — controller com os mesmos dois métodos do padrão Scania, aplicado à frota Actros/Atego.

**Exercício 2 — registrar o roteador da Mercedes em `server.js`**
```js
// ------- CÓDIGO ANTIGO (já existe) -------
const scaniaRoutes = require('./src/routes/scaniaRoutes');
app.use('/api/v1/telemetria/scania', scaniaRoutes);

// ------- CÓDIGO NOVO (adicionar aqui) -------
const mercedesRoutes = require('./src/routes/mercedesRoutes');
app.use('/api/v1/telemetria/mercedes', mercedesRoutes);
```
Teste (só leitura):
```bash
curl -s http://localhost:3013/api/v1/telemetria/mercedes | jq .
```
✅ **já no código.**

**Exercício 3 — middleware `src/middlewares/validaVin.js`**
```js
const validaVin = (req, res, next) => {
  const { vin } = req.body;
  if (!vin || typeof vin !== 'string' || vin.trim().length !== 12) {
    return res.status(400).json({
      erro: "Validação recusada: O código VIN é obrigatório e deve ter exatamente 12 caracteres."
    });
  }
  next();
};
module.exports = validaVin;
```
✅ **já no código** (uma vez corrigido o Bug 1 acima).

**Exercício 4 — aplicar `validaVin` no POST da Scania**

O middleware está pronto e importado, mas ainda **não está encadeado na rota**. Em `src/routes/scaniaRoutes.js`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
router.post('/', scaniaController.registrarTelemetria);

// ------- CÓDIGO NOVO (troque a linha acima por esta) -------
router.post('/', validaVin, scaniaController.registrarTelemetria);
```
Testar com um VIN inválido (menos de 12 caracteres) — não afeta os dados já cadastrados nos outros testes, só recusa esse POST específico:
```bash
curl -i -X POST http://localhost:3013/api/v1/telemetria/scania \
  -H "Content-Type: application/json" \
  -d '{"modelo":"R450","vin":"9BS123","temperatura_motor":88}'
```
Resultado esperado: `400 Bad Request` com a mensagem do `validaVin`. Testado e confirmado com as correções acima.

**Exercício 5 — script `auditoria_completa.sh`**

Consulta Scania, Mercedes, um POST inválido (VIN errado) e uma rota inexistente (Volvo), tudo salvo em `auditoria.log`:

```bash
bash auditoria_completa.sh
cat auditoria.log
```
✅ **já no código** — só passa a bater 100% com o esperado depois das correções dos Bugs 1 e 2 (o `auditoria.log` salvo no repositório é de uma versão anterior do código e mostra a Mercedes caindo em 404, exatamente o sintoma do Bug 2).

---

### Aula 08 — SQLite3 + Knex.js e migrations

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula08 && cd aula08
npm install
npx knex migrate:latest
```

> **Nota:** o `knexfile.js` do projeto usa o client `better-sqlite3` em vez do `sqlite3` sugerido pelo professor no PASSO 2. Os dois são drivers válidos para o Knex — a diferença não é um erro, é só uma troca de driver, e está consistente entre `package.json` e `knexfile.js`. Se a prova pedir para seguir o material exatamente, basta saber que existe essa troca.

`knexfile.js` aponta para `database.sqlite` e para as migrations em `src/database/migrations`. `src/database/connection.js` exporta a instância do Knex já configurada. A migration `20260820_create_veiculos.js` cria a tabela `veiculos` (`id`, `placa` único, `montadora`, `modelo`, `status` padrão `"disponivel"`, `criado_em`).

`src/controllers/veiculosController.js` com `listarTodos` (GET) e `criar` (POST, trata `409` em caso de placa duplicada). `src/routes/veiculosRoutes.js` liga tudo em `/api/v1/veiculos`.

```bash
node server.js &
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" -d '{"placa":"SCA-2026","montadora":"Scania","modelo":"R500"}' | jq .
curl -s http://localhost:3013/api/v1/veiculos | jq .
```

✅ **corrigido — typo no `testar_banco.sh`.** No passo `[2]` (cadastro do veículo Mercedes-Benz), o header original estava escrito como `"Content-Type: application.json"` (ponto em vez de barra). Como o Express só faz o parse do corpo quando o `Content-Type` é exatamente `application/json`, esse passo caía no `400 Bad Request` ("campos obrigatórios") em vez do `201 Created` esperado — testei e confirmei esse comportamento antes da correção. Já apliquei a correção no `binario_tech_correcoes.zip`, a linha do passo `[2]` ficou:
```bash
curl -s -X POST http://localhost:3013/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"MBB-2026","montadora":"Mercedes-Benz","modelo":"Actros 2651"}' | jq .
```

**Exercício 1 — `buscarPorId`**

Dentro de `src/controllers/veiculosController.js`, como mais um método do objeto/exports que já tem `listarTodos` e `criar`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
async criar(req, res) {
  // ... lógica de cadastro já existente ...
}

// ------- CÓDIGO NOVO (adicionar aqui) -------
async buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const veiculo = await db('veiculos').where({ id }).first();
    if (!veiculo) return res.status(404).json({ mensagem: 'Veículo não encontrado' });
    return res.status(200).json(veiculo);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor', erro: error.message });
  }
}
```
Teste (só leitura):
```bash
curl -i http://localhost:3013/api/v1/veiculos/999
```
✅ **já no código** — testado, retorna `404` para ID inexistente.

**Exercício 2 — PATCH `/:id/status`**

Dentro de `src/routes/veiculosRoutes.js`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
router.get('/:id', veiculosController.buscarPorId);

// ------- CÓDIGO NOVO (adicionar aqui) -------
router.patch('/:id/status', veiculosController.atualizarStatus);
```
Teste isolado (cadastra um veículo próprio antes de mudar o status dele, sem afetar os IDs usados em outros testes):
```bash
NOVO=$(curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{"placa":"PATCH-01","montadora":"Volvo","modelo":"FH"}')
ID=$(echo "$NOVO" | jq -r '.id')
curl -s -X PATCH http://localhost:3013/api/v1/veiculos/$ID/status -H "Content-Type: application/json" -d '{"status":"MANUTENCAO"}' | jq .
```
✅ **já no código.**

**Exercício 3 — migration da tabela `motoristas`**
```js
exports.up = function(knex) {
  return knex.schema.createTable('motoristas', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cnh').notNullable().unique();
    table.string('categoria').notNullable();
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable('motoristas');
};
```
```bash
npx knex migrate:latest
```
✅ **já no código** — tabela `motoristas` confirmada no banco.

**Exercício 4 — rollback e reaplicação**
```bash
npx knex migrate:rollback
npx knex migrate:latest
```

---

### Aula 09 — Relacionamentos, Foreign Keys e Joins

> ✅ **corrigido — o `POST /api/v1/telemetria` devolvia 500.** Bug confirmado rodando o servidor: o `registrarLeitura` tentava gravar campos que não existem na tabela. Já apliquei a correção no `binario_tech_correcoes.zip`.

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula09 && cd aula09
npm install
npx knex migrate:latest
```

Duas migrations: `veiculos` (tabela pai: `id`, `placa` único, `montadora`, `modelo`) e `telemetria` (tabela filho: `id`, `veiculo_id`, `velocidade`, `temperatura_motor`, `capturado_em`, com `table.foreign('veiculo_id').references('id').inTable('veiculos').onDelete('CASCADE')`).

```bash
node server.js &
curl -s -X POST http://localhost:3013/api/v1/telemetria/veiculo-teste -H "Content-Type: application/json" -d '{"placa":"SCA-9900","montadora":"Scania","modelo":"R450"}' | jq .
```

**Bug (já corrigido) — `registrarLeitura` inseria colunas que não existem**

O código original em `src/controllers/telemetriaController.js` estava assim:
```js
const { veiculo_id, temperatura_motor, velocidade, latitude, longitude } = req.body;
// ...
const [id] = await db('telemetria').insert({
  veiculo_id,
  temperatura_motor,
  velocidade,
  latitude,      // <- não existe na tabela 'telemetria'
  longitude,     // <- não existe na tabela 'telemetria'
  data_hora: new Date()   // <- a coluna certa se chama 'capturado_em' e já tem valor padrão
});
```
A tabela `telemetria` só tem `id`, `veiculo_id`, `velocidade`, `temperatura_motor` e `capturado_em` (a migration não criou `latitude`, `longitude` nem `data_hora`). O Knex tentava gravar colunas inexistentes e o SQLite recusava a query, caindo no `catch` e devolvendo `500`. Testei e confirmei o erro antes da correção. A correção (já aplicada) — removeu os campos que a tabela não tem:
```js
const { veiculo_id, temperatura_motor, velocidade } = req.body;
// ...
const [id] = await db('telemetria').insert({
  veiculo_id,
  temperatura_motor,
  velocidade
});
```
Depois disso o `POST` volta a funcionar normalmente:
```bash
curl -s -X POST http://localhost:3013/api/v1/telemetria -H "Content-Type: application/json" -d '{"veiculo_id":1,"velocidade":88.5,"temperatura_motor":92.0}' | jq .
curl -s http://localhost:3013/api/v1/telemetria/relatorio | jq .
```

**Exercício 1 — `buscarPorVeiculo`**

Dentro de `src/controllers/telemetriaController.js`, como mais um método do objeto (junto de `registrarLeitura`):
```js
// ------- CÓDIGO ANTIGO (já existe, fim do registrarLeitura) -------
  },

// ------- CÓDIGO NOVO (adicionar aqui) -------
  async buscarPorVeiculo(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await db('veiculos').where({ id }).first();
      if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado.' });
      const leituras = await db('telemetria').where({ veiculo_id: id });
      return res.json(leituras);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },
```
Teste (só leitura, não altera nada):
```bash
curl -s http://localhost:3013/api/v1/telemetria/veiculo/1 | jq .
```
✅ **já no código.**

**Exercício 2 — `veiculo_id` inexistente → 404**
```bash
curl -i -X POST http://localhost:3013/api/v1/telemetria -H "Content-Type: application/json" -d '{"veiculo_id":999,"velocidade":1,"temperatura_motor":1}'
```
Resultado esperado e confirmado: `404 Not Found` com `{"erro":"Veículo não encontrado para o ID informado."}` — esse teste específico funciona mesmo com o bug acima, porque a validação do veículo acontece antes do `insert`.

**Exercício 3 — filtro `?alerta=true`**

Dentro do método `listarRelatorioCompleto`, depois de montar a query base e antes de executá-la:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
let query = db('telemetria')
  .join('veiculos', 'telemetria.veiculo_id', '=', 'veiculos.id')
  .select('telemetria.*', 'veiculos.placa', 'veiculos.modelo', 'veiculos.montadora');

// ------- CÓDIGO NOVO (adicionar aqui) -------
if (alerta === 'true') {
  query = query.where('telemetria.temperatura_motor', '>', 95);
}

// ------- CÓDIGO ANTIGO (continua abaixo) -------
const relatorio = await query;
return res.json(relatorio);
```
Teste (só leitura):
```bash
curl -s "http://localhost:3013/api/v1/telemetria/relatorio?alerta=true" | jq .
```
✅ **já no código.**

**Exercício 4 — cadastrar Volkswagen Delivery + 2 leituras**
```bash
curl -s -X POST http://localhost:3013/api/v1/telemetria/veiculo-teste \
  -H "Content-Type: application/json" \
  -d '{"placa":"VW-0001","montadora":"Volkswagen","modelo":"Delivery"}' | jq .

curl -s -X POST http://localhost:3013/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id":2,"velocidade":70,"temperatura_motor":85}' | jq .

curl -s -X POST http://localhost:3013/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id":2,"velocidade":75,"temperatura_motor":90}' | jq .
```
(ajuste o `veiculo_id` conforme o ID retornado no cadastro do veículo).

---

### Aula 10 — Validação, tratamento de erros e Seeds

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula10 && cd aula10
npm install
npx knex migrate:latest
npx knex seed:run
```

Uma migration única cria `veiculos` e `telemetria` (com FK). O seed `01_povoar_frota.js` limpa e povoa as duas tabelas com Volvo FH 540 e Scania R500 + 3 leituras. `src/middlewares/tratarErros.js` é o middleware central de erro (`(err, req, res, next)`), registrado por último no `server.js`, tratando `UNIQUE constraint failed` → 409, `FOREIGN KEY constraint failed` → 400 e erro genérico → 500.

> **Nota sobre os nomes das rotas:** no seu `frotaRoutes.js` atual as rotas estão como `GET /relatorio` e `POST /veiculo-teste` (dentro de `/api/v1/frota`), diferente dos nomes `/` e `/veiculo` do material original — provavelmente você renomeou durante os testes da bateria de exercícios, e tudo bem, o comportamento é o mesmo. Só fique de olho: o `testar_aula10.sh` que está salvo na pasta ainda chama os caminhos antigos (`/api/v1/frota` e `/api/v1/frota/veiculo`), então rodá-lo direto vai dar `404`. Use os comandos abaixo, que já apontam para as rotas reais do seu código:

```bash
node server.js &
curl -s http://localhost:3013/api/v1/frota/relatorio | jq .
curl -s -X POST http://localhost:3013/api/v1/frota/veiculo-teste \
  -H "Content-Type: application/json" \
  -d '{"placa":"VOL-1010","montadora":"Volvo","modelo":"FH 540"}' | jq .   # placa duplicada -> 409
```

**Exercício 1 — seed `02_povoar_mais_veiculos.js`**
```js
exports.seed = async function(knex) {
  await knex('veiculos').insert([
    { montadora: 'Mercedes-Benz', modelo: 'Accelo 1016', placa: 'MBB2E45' },
    { montadora: 'DAF', modelo: 'XF 530', placa: 'DAF9F88' }
  ]);
};
```
```bash
npx knex seed:run
```
✅ **já no código** — insere sem apagar o que já existe (sem `.del()`).

**Exercício 2 — capturar `SyntaxError` de JSON malformado**

Dentro de `src/middlewares/tratarErros.js`, logo no início da função `tratarErros`, antes dos outros tratamentos (`UNIQUE constraint`, `FOREIGN KEY`):
```js
// ------- CÓDIGO ANTIGO (já existe) -------
function tratarErros(err, req, res, next) {
  console.error(`[ERRO LOG]: ${err.message}`);

// ------- CÓDIGO NOVO (adicionar aqui) -------
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: "O corpo da requisição contém um formato JSON inválido." });
  }

// ------- CÓDIGO ANTIGO (continua abaixo, os outros tratamentos) -------
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ erro: "Conflito de dados: Registro já existe com este valor único (ex: Placa)." });
  }
  // ...
}
```
Teste (só dispara um erro de parsing, não grava nada no banco):
```bash
curl -s -X POST http://localhost:3013/api/v1/frota/veiculo-teste \
  -H "Content-Type: application/json" \
  -d '{ "montadora": "Volvo", "modelo": "FH", '
```
✅ **já no código** — retorna `400` com a mensagem amigável.

**Exercício 3 — script `"db:reset"`**

Dentro de `package.json` (é JSON puro, não aceita comentário — a marcação aqui é só para indicar onde a linha entra dentro do bloco `"scripts"` que já existe):
```json
"scripts": {
  "start": "node server.js",
  "db:reset": "npx knex migrate:rollback --all && npx knex migrate:latest && npx knex seed:run"
}
```
Rodar (⚠️ isso reseta o banco inteiro — não é um teste "seguro", é destrutivo por natureza; só rode se quiser mesmo recomeçar do zero):
```bash
npm run db:reset
```
✅ **já no código.**

**Exercício 4 — cadastro sem `placa` → 400**
```bash
curl -s -X POST http://localhost:3013/api/v1/frota/veiculo-teste \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Scania","modelo":"R450"}'
```
Resultado esperado: `{"erro":"Campos 'placa', 'montadora' e 'modelo' são obrigatorios."}` com status `400`.

---

### Aula 11 — MongoDB e Mongoose

**Diferença importante do seu projeto:** em vez de usar `mongoose.connect()` direto num Mongo real (que exigiria o Docker do README), o seu `src/config/database.js` usa o pacote `mongodb-memory-server`, que sobe um MongoDB temporário **em memória** sozinho, sem precisar de Docker nem de `127.0.0.1:27017` rodando. Isso significa que a aula 11 funciona sozinha — não precisa do `docker run` da seção 2 deste README.

> Na primeira execução, o `mongodb-memory-server` baixa o binário do MongoDB da internet (só na primeira vez; depois fica em cache). Se a prova for num ambiente sem internet, essa aula pode falhar por causa disso — se acontecer, o erro no terminal vai mencionar `DownloadError` / `fastdl.mongodb.org`. A solução ali seria trocar `src/config/database.js` para usar `mongoose.connect()` com uma URI real (`mongodb://127.0.0.1:27017/...`) e subir o Mongo via Docker (seção 2 deste README) em vez do memory server.

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula11/src/config aula11/src/models aula11/src/controllers aula11/src/routes
cd aula11
npm install
node server.js &
```

`src/models/Alerta.js` define o schema (`equipamentoId`, `nivelSeveridade` com enum `BAIXO/MEDIO/CRITICO`, `temperaturaMedida`, `tags` — array de strings —, `metadados` como `Map`, `registradoEm`). `alertaController.js` com `criarAlerta` (POST) e `listarAlertas` (GET, ordenado por `registradoEm` decrescente).

```bash
chmod +x testar_nosql.sh
./testar_nosql.sh
```

✅ **já no código** — inclui também o exercício 1 (`buscarPorSeveridade`) e o exercício 2 (campo `tags`).

**Exercício 1 — `buscarPorSeveridade`**

Dentro de `src/controllers/alertaController.js`, mais um método no objeto (junto de `criarAlerta` e `listarAlertas`), e a rota correspondente em `src/routes/alertaRoutes.js`:
```js
// ------- CÓDIGO ANTIGO (já existe, em alertaController.js) -------
listarAlertas: async (req, res) => {
  try {
    const alertas = await Alerta.find().sort({ registradoEm: -1 });
    res.status(200).json(alertas);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao consultar coleção no MongoDB" });
  }
},

// ------- CÓDIGO NOVO (adicionar aqui, em alertaController.js) -------
buscarPorSeveridade: async (req, res) => {
  try {
    const { nivel } = req.params;
    const alertas = await Alerta.find({ nivelSeveridade: nivel.toUpperCase() }).sort({ registradoEm: -1 });
    res.status(200).json(alertas);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar alertas por severidade", detalhe: erro.message });
  }
}
```
```js
// ------- CÓDIGO ANTIGO (já existe, em alertaRoutes.js) -------
router.get('/', alertaController.listarAlertas);

// ------- CÓDIGO NOVO (adicionar aqui, em alertaRoutes.js) -------
router.get('/severidade/:nivel', alertaController.buscarPorSeveridade);
```
Teste (só leitura):
```bash
curl -s http://localhost:3013/api/v1/alertas/severidade/critico | jq .
```
✅ **já no código.**

**Exercício 2 — campo `tags` (array de strings)**

Dentro de `src/models/Alerta.js`, mais um campo no schema:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
temperaturaMedida: {
  type: Number,
  required: true
},

// ------- CÓDIGO NOVO (adicionar aqui) -------
tags: [String],

// ------- CÓDIGO ANTIGO (continua abaixo) -------
metadados: {
  type: Map,
  of: String
},
```
✅ **já no código.**
Teste isolado (cria um alerta descartável só para conferir que o array `tags` é salvo, sem mexer em outros registros):
```bash
curl -s -X POST http://localhost:3013/api/v1/alertas -H "Content-Type: application/json" \
  -d '{"equipamentoId":"TESTE-TAGS","nivelSeveridade":"BAIXO","temperaturaMedida":50,"tags":["teste1","teste2"]}' | jq '.tags'
```

**Exercício 3 — `nivelSeveridade` inválido → erro de enum**
```bash
curl -s -X POST http://localhost:3013/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{"equipamentoId":"TESTE-ENUM-01","nivelSeveridade":"INVALIDO","temperaturaMedida":75.0}' | jq .
```
Resultado esperado: `400` com o erro de validação do Mongoose reclamando que `INVALIDO` não é um valor válido do enum de `nivelSeveridade`.

**Exercício 4 — alerta `BAIXO` com metadados customizados**
```bash
curl -s -X POST http://localhost:3013/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{
    "equipamentoId": "VOLVO-FH540-02",
    "nivelSeveridade": "BAIXO",
    "temperaturaMedida": 68.2,
    "tags": ["superaquecimento", "manutencao_urgente"],
    "metadados": { "tipoCarga": "Perecíveis", "velocidade": "80 km/h" }
  }' | jq .
```

---

### Aula 12 — CRUD completo NoSQL

> Diferente da aula 11, esta usa `mongoose.connect()` direto com a URI do `.env` — **precisa** do Mongo rodando via Docker (seção 2 deste README) antes de `node server.js`.

**Preparação:**

```bash
docker run -d -p 27017:27017 --name mongo-simulado mongo:latest   # se ainda não estiver rodando
cd ~/binario_tech && mkdir -p aula12/src/config aula12/src/models aula12/src/controllers aula12/src/routes
cd aula12
npm install
node server.js &
```

`src/models/Manutencao.js`: `itemPecaSchema` (subdocumento: `nomePeca`, `quantidade`, `custoUnitario`) embutido no array `pecasSubstituidas` de `manutencaoSchema` (`veiculoPlaca`, `tipoManutencao` enum, `custoTotal`, `status` enum). `manutencaoController.js` com `criar`, `listarComFiltros` (`?minCusto=` usa `$gte`, `?status=`), `atualizarStatus` (PATCH) e `excluir` (DELETE).

```bash
chmod +x testar_crud_nosql.sh
./testar_crud_nosql.sh
```

✅ **já no código** — os 4 exercícios abaixo estão implementados (dá pra ver no próprio arquivo, que guardou as versões anteriores comentadas em `/* Codigo 0 ... Codigo 1 ... */` antes da versão final).

**Exercício 1 — busca por placa com `$regex` case-insensitive**

Em `manutencaoController.js`, mais um método; em `manutencaoRoutes.js`, a rota correspondente:
```js
// ------- CÓDIGO ANTIGO (já existe, em manutencaoController.js) -------
listarComFiltros: async (req, res) => { /* ... já existente ... */ },

// ------- CÓDIGO NOVO (adicionar aqui, em manutencaoController.js) -------
buscarPorPlaca: async (req, res) => {
  try {
    const { placa } = req.params;
    const manutencoes = await Manutencao.find({ veiculoPlaca: { $regex: placa, $options: 'i' } });
    res.status(200).json(manutencoes);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar manutenções pela placa.", detalhe: erro.message });
  }
}
```
```js
// ------- CÓDIGO ANTIGO (já existe, em manutencaoRoutes.js) -------
router.get('/', manutencaoController.listarComFiltros);

// ------- CÓDIGO NOVO (adicionar aqui, em manutencaoRoutes.js) -------
router.get('/placa/:placa', manutencaoController.buscarPorPlaca);
```
Teste (só leitura):
```bash
curl -s http://localhost:3013/api/v1/manutencoes/placa/sca | jq .
```
✅ **já no código.**

**Exercício 2 — adicionar peça com `$push`**
```js
// ------- CÓDIGO ANTIGO (já existe, em manutencaoController.js) -------
buscarPorPlaca: async (req, res) => { /* ... já existente ... */ },

// ------- CÓDIGO NOVO (adicionar aqui, em manutencaoController.js) -------
adicionarPeca: async (req, res) => {
  const { id } = req.params;
  const manutencaoAtualizada = await Manutencao.findByIdAndUpdate(
    id,
    { $push: { pecasSubstituidas: req.body } },
    { new: true, runValidators: true }
  );
  // ...
}
```
```js
// ------- CÓDIGO NOVO (adicionar em manutencaoRoutes.js) -------
router.post('/:id/pecas', manutencaoController.adicionarPeca);
```
✅ **já no código** — rota `POST /:id/pecas`.

Teste isolado (cria uma manutenção própria e adiciona a peça só nela, sem tocar em outros registros):
```bash
NOVA=$(curl -s -X POST http://localhost:3013/api/v1/manutencoes -H "Content-Type: application/json" \
  -d '{"veiculoPlaca":"TST-0001","tipoManutencao":"PREVENTIVA","custoTotal":500}')
ID=$(echo "$NOVA" | jq -r '._id')
curl -s -X POST http://localhost:3013/api/v1/manutencoes/$ID/pecas \
  -H "Content-Type: application/json" \
  -d '{"nomePeca":"Pastilha de freio","quantidade":4,"custoUnitario":80}' | jq .
```

**Exercício 3 — `custoUnitario` não pode ser negativo**

Dentro de `src/models/Manutencao.js`, no `itemPecaSchema`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
const itemPecaSchema = new mongoose.Schema({
  nomePeca: { type: String, required: true },
  quantidade: { type: Number, required: true, default: 1 },
  custoUnitario: { type: Number, required: true }
});

// ------- CÓDIGO NOVO (troque a linha do custoUnitario acima por esta) -------
custoUnitario: {
  type: Number,
  required: true,
  min: [0, 'O custo unitário não pode ser negativo.']
}
```
✅ **já no código.**

Teste isolado (tentativa deliberadamente inválida — não chega a criar registro, então não afeta nada):
```bash
curl -s -X POST http://localhost:3013/api/v1/manutencoes -H "Content-Type: application/json" \
  -d '{"veiculoPlaca":"TST-NEGATIVO","tipoManutencao":"CORRETIVA","custoTotal":100,"pecasSubstituidas":[{"nomePeca":"Item","quantidade":1,"custoUnitario":-50}]}' | jq .
```
Resultado esperado: `400` com o erro de validação do `min`.

**Exercício 4 — deletar por `_id`**

Teste isolado (cria uma manutenção descartável só para apagar):
```bash
NOVA=$(curl -s -X POST http://localhost:3013/api/v1/manutencoes -H "Content-Type: application/json" \
  -d '{"veiculoPlaca":"DEL-0001","tipoManutencao":"PREVENTIVA","custoTotal":10}')
ID=$(echo "$NOVA" | jq -r '._id')
curl -i -X DELETE http://localhost:3013/api/v1/manutencoes/$ID
```
Resultado esperado: `200` com `{"mensagem":"Registro de manutencao excluido com sucesso!"}`.

---

### Aula 13 — Express-Validator e HTTP Status Codes

> ✅ **corrigido — a validação dos dados não estava funcionando.** Um payload inválido devolvia `201 Created` em vez de `422`. Bug confirmado rodando o servidor, já corrigido no `binario_tech_correcoes.zip`.

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula13/src/middlewares aula13/src/controllers aula13/src/routes
cd aula13
npm install
node server.js &
```

`src/middlewares/veiculoValidator.js` define as regras (`placa`, `chassi` com 17 caracteres, `capacidadeCargaKg` mínimo 100). `src/routes/veiculoRoutes.js` encadeia `regrasCadastroVeiculo → validarRequisicao → veiculoController.cadastrar`.

**Bug (já corrigido) — `src/middlewares/validarRequisicao.js` estava com o conteúdo errado**

Esse arquivo deveria checar o resultado das regras do `express-validator` (`validationResult(req)`) e devolver `422` se houver erro. Só que o conteúdo original dele era, na verdade, uma cópia da checagem de `Content-Type`:

```js
// conteúdo ORIGINAL de validarRequisicao.js (errado — devia ser outra coisa)
const validarContentType = (req, res, next) => {
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({ status: "REQUISICAO_INVALIDA", mensagem: "..." });
    }
  }
  next();
};
module.exports = validarContentType;
```

Como esse middleware nunca chamava `validationResult(req)`, as regras de `veiculoValidator.js` (placa, chassi, capacidade) eram registradas mas **nunca checadas** — qualquer payload passava direto para o controller e recebia `201`, mesmo estando incompleto ou com tamanho errado. Testei e confirmei antes da correção: `{"placa":"ABC","chassi":"123","capacidadeCargaKg":50}` retornava `201` em vez do `422` esperado.

A correção (já aplicada no `binario_tech_correcoes.zip`) — o conteúdo de `validarRequisicao.js` voltou a ser este:
```js
const { validationResult } = require('express-validator');

const validarRequisicao = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(422).json({
      status: "ERRO_VALIDACAO",
      erros: erros.array().map(err => ({ campo: err.path, mensagem: err.msg }))
    });
  }
  next();
};

module.exports = validarRequisicao;
```

Com isso corrigido, os testes voltam a bater com o esperado:
```bash
curl -i -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{ "placa": "ABC", "chassi": "123", "capacidadeCargaKg": 50 }'
# 422 com a lista de erros

curl -i -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{ "placa": "abc-1234", "chassi": "19BMSR450XYZ12345", "capacidadeCargaKg": 15000 }'
# 201, com a placa em maiúsculas (ABC-1234) por causa do sanitizador do exercício 1
```

**Exercício 1 — sanitizar `placa` para maiúsculas**

Dentro de `src/middlewares/veiculoValidator.js`, na regra de `placa` já existente:
```js
// ------- CÓDIGO ANTIGO (já existia, sem o .toUpperCase()) -------
body('placa')
  .notEmpty().withMessage('A placa do veículo é obrigatória.')
  .isString().withMessage('A placa deve ser um texto.')
  .trim()
  .isLength({ min: 7, max: 8 }).withMessage('A placa deve ter entre 7 e 8 caracteres.'),

// ------- CÓDIGO NOVO (a mesma regra, com .toUpperCase() adicionado) -------
body('placa')
  .notEmpty().withMessage('A placa do veículo é obrigatória.')
  .isString().withMessage('A placa deve ser um texto.')
  .trim()
  .toUpperCase()
  .isLength({ min: 7, max: 8 }).withMessage('A placa deve ter entre 7 e 8 caracteres.'),
```
✅ **já no código.**

**Exercício 2 — `anoFabricacao` opcional (2000 até o ano atual)**

Dentro do mesmo arquivo, depois da regra de `capacidadeCargaKg` e dentro do array `regrasCadastroVeiculo`:
```js
// ------- CÓDIGO ANTIGO (já existe, última regra do array) -------
body('capacidadeCargaKg')
  .notEmpty().withMessage('A capacidade de carga é obrigatória.')
  .isFloat({ min: 100 }).withMessage('A capacidade de carga deve ser um número maior ou igual a 100 Kg.'),

// ------- CÓDIGO NOVO (adicionar como novo item do array) -------
body('anoFabricacao')
  .optional()
  .isInt({ min: 2000, max: anoAtual })
  .withMessage(`O ano de fabricação deve ser um número inteiro entre 2000 e ${anoAtual}.`)
```
✅ **já no código.**
Teste isolado (não precisa de banco, é só uma validação — envia um ano fora do intervalo):
```bash
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{"placa":"abc-1234","chassi":"19BMSR450XYZ12345","capacidadeCargaKg":15000,"anoFabricacao":1990}' | jq .
```
Resultado esperado: `422` reclamando do `anoFabricacao`.

**Exercício 3 — middleware de `Content-Type`**

Está em um arquivo separado, `src/middlewares/validarContentType.js` (não confundir com `validarRequisicao.js` acima), aplicado globalmente no `server.js` para POST/PUT/PATCH:
```js
module.exports = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ status: "ERRO_CONTENT_TYPE", mensagem: "..." });
    }
  }
  next();
};
```
```bash
curl -i -X POST http://localhost:3013/api/v1/veiculos -d 'x=1'
```
✅ **já no código** — retorna `415` (o material original sugere `400`; `415 Unsupported Media Type` também é uma resposta tecnicamente correta para esse caso, mas se a prova pedir exatamente `400`, é só trocar o `res.status(415)` para `res.status(400)`).

**Exercício 4 — extrair só as mensagens de erro com jq**
```bash
curl -s -X POST http://localhost:3013/api/v1/veiculos -H "Content-Type: application/json" \
  -d '{ "placa": "abc", "chassi": "123", "capacidadeCargaKg": 10 }' | jq '.erros[].mensagem'
```
(depende da correção do bug acima para funcionar.)

---

### Aula 14 — JWT, Bcrypt e Autorização

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula14/src/middlewares aula14/src/controllers aula14/src/routes
cd aula14
npm install
node server.js &
```

`src/controllers/authController.js` guarda usuários em memória (`usuariosDB`), com `registrar` (hash da senha via `bcrypt.hash`), `login` (verifica com `bcrypt.compare` e emite JWT) e `perfil` (lê `req.usuario`, injetado pelo middleware). `src/middlewares/autenticarToken.js` exige `Authorization: Bearer <token>`.

> **Atenção ao testar:** o `login` deste projeto está emitindo o token com `expiresIn: '15s'` (mudança do exercício 2, deixada no código). Isso significa que qualquer token que você pegar de um login vai expirar em 15 segundos — teste a rota protegida logo em seguida, ou troque de volta para `'1h'` em `authController.js` se for atrapalhar os outros testes.

```bash
chmod +x testar_jwt.sh
./testar_jwt.sh
```

**Exercício 1 — `autorizarPerfil(perfisPermitidos)`**
```js
const autorizarPerfil = (perfisPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.perfil) {
      return res.status(403).json({ status: "ERRO", mensagem: "Acesso negado. Informações de perfil ausentes." });
    }
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ status: "ERRO", mensagem: `Acesso negado. Perfil '${req.usuario.perfil}' não tem permissão para acessar este recurso.` });
    }
    next();
  };
};
module.exports = autorizarPerfil;
```
✅ **já no código**, em `src/middlewares/autorizarPerfil.js` — mas ele ainda **não está aplicado em nenhuma rota**. Para usar, em `authRoutes.js`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticarToken = require('../middlewares/autenticarToken');

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.get('/perfil', autenticarToken, authController.perfil);

// ------- CÓDIGO NOVO (adicionar) -------
const autorizarPerfil = require('../middlewares/autorizarPerfil');

router.get('/admin/dashboard', autenticarToken, autorizarPerfil(['ADMIN']), (req, res) => {
  res.status(200).json({ mensagem: "Bem-vindo, admin!" });
});
```
Teste (não interfere com o restante — é só uma rota nova):
```bash
curl -s http://localhost:3013/api/v1/auth/admin/dashboard -H "Authorization: Bearer $TOKEN" | jq .
```

**Exercício 2 — expiração em 15s**

Dentro de `src/controllers/authController.js`, no método `login`:
```js
// ------- CÓDIGO ANTIGO (valor original, 1 hora) -------
const token = jwt.sign(
  { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// ------- CÓDIGO NOVO (troque só o expiresIn) -------
const token = jwt.sign(
  { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
  process.env.JWT_SECRET,
  { expiresIn: '15s' }
);
```
✅ **já no código** — faça login, espere passar de 15 segundos e tente acessar `/perfil` de novo:
```bash
curl -s http://localhost:3013/api/v1/auth/perfil -H "Authorization: Bearer $TOKEN" | jq .
```
Resultado esperado: `403` com `"Token inválido ou expirado."`.

**Exercício 3 — senha com menos de 6 caracteres → 400**

Dentro de `src/controllers/authController.js`, no método `registrar`, logo depois de checar se `email`/`senha` foram enviados:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
if (!email || !senha) {
  return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
}

// ------- CÓDIGO NOVO (adicionar logo abaixo) -------
if (senha.length < 6) {
  return res.status(400).json({ status: "ERRO", mensagem: "A senha deve conter no mínimo 6 caracteres." });
}
```
Teste isolado (e-mail de teste que não colide com os outros usuários já cadastrados):
```bash
curl -i -X POST http://localhost:3013/api/v1/auth/register -H "Content-Type: application/json" \
  -d '{"email":"teste_senha_curta@x.com","senha":"123"}'
```
✅ **já no código.**

**Exercício 4 — token corrompido → 403**
```bash
curl -s http://localhost:3013/api/v1/auth/perfil -H "Authorization: Bearer token.invalido.corrompido" | jq .
```
Resultado esperado: `403 Forbidden` com `"Token inválido ou expirado."`.

---

### Aula 15

Não existe orientação nem pasta de projeto para a "aula 15" — o material do professor pula direto da aula 14 para a aula 16. Se a prova mencionar "aula 15", provavelmente é engano de numeração; o conteúdo mais próximo por ordem cronológica é a Aula 16 (processos, PIDs e portas em uso), logo abaixo.

---

### Aula 16 — Processos, PIDs e portas em uso

**Contexto:** esta aula é sobre sincronizar o projeto entre o Google Cloud Shell e o servidor Linux da sala via Git/SSH — não é sobre escrever uma API nova, é sobre versionamento.

**Preparação (no servidor da sala):**

```bash
ssh usuario_aluno@192.168.X.X
git clone https://github.com/SEU_USUARIO/binario_tech.git
cd binario_tech
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu_email@aluno.com"
mkdir -p aula16 && cd aula16
npm init -y && npm install express
```

`servidor_check.js` — endpoint simples de status:
```js
app.get('/api/v1/status-servidor', (req, res) => {
  res.json({
    status: "ONLINE",
    ambiente: "Servidor Local de Prova - Binário Tech",
    usuario: process.env.USER || "aluno",
    dataCheck: new Date()
  });
});
```
```bash
node servidor_check.js &
curl -s http://localhost:3013/api/v1/status-servidor | jq .
```
✅ **já no código.**

```bash
cd ~/binario_tech
git status
git add .
git commit -m "feat: configuracao e sincronizacao do servidor de aula - aula16"
git push origin main
```

**Exercício 1 — testar `git pull`**
```bash
# No Cloud Shell: alterar um arquivo, commitar e dar push
# No servidor da sala:
git pull origin main
```

**Exercício 2 — `.gitignore` ignorando `node_modules` e `.env`**
```
node_modules/
.env
```
✅ **já no código** — está na raiz do projeto (`binario_tech/.gitignore`), cobrindo todas as aulas de uma vez.

**Exercício 3 — `auditoria_servidor.sh`**
```bash
ps aux | grep node >> processos.log
```
```bash
bash auditoria_servidor.sh
cat processos.log
```
✅ **já no código.**

**Exercício 4 — commit + push do script e conferir no GitHub**
```bash
git add aula16/auditoria_servidor.sh
git commit -m "feat: script de auditoria de processos - aula16"
git push origin main
```
Depois, confira em `https://github.com/SEU_USUARIO/binario_tech` se a pasta `aula16` e o script aparecem.

---

### Aula 17 — Revisão geral e checklist de avaliação

> Esta aula precisa do Mongo rodando via Docker (usa `mongoose.connect()` direto, sem memory server) — suba com `docker run -d -p 27017:27017 --name mongo-simulado mongo:latest` antes de `node server.js`.

**Preparação:**

```bash
docker run -d -p 27017:27017 --name mongo-simulado mongo:latest
cd ~/binario_tech/aula17
npm install
node server.js &
curl -s http://localhost:3013/api/v1/health | jq .
```

`src/middlewares/autenticar.js` — mesmo padrão JWT das aulas anteriores. `server.js` já inclui a rota pública `/api/v1/health`, a rota `POST /api/v1/auth/token-teste` (exercício 2) e a rota protegida `/api/v1/simulado/status`.

**Exercício 1 — `testar_simulado.sh` salvando o status em `health_check.log`**

✅ **corrigido — o script apontava para a porta errada.** Ele testava `http://localhost:3000/...`, mas o servidor sobe na **3013** (conforme `.env`). Por isso o `health_check.log` salvo no repositório original mostrava `Status Code: 000` (conexão recusada). Já corrigi a URL dentro do script (aplicado no `binario_tech_correcoes.zip`):
```bash
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3013/api/v1/health)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] HTTP Status Code: $STATUS_CODE" >> health_check.log
```
```bash
bash testar_simulado.sh
cat health_check.log
```
Resultado esperado: `Status Code: 200`.

**Exercício 2 — `POST /api/v1/auth/token-teste` (token de 5 minutos)**

Dentro de `server.js`, entre a rota `/api/v1/health` e a rota protegida `/api/v1/simulado/status`:
```js
// ------- CÓDIGO ANTIGO (já existe) -------
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "PRONTO_PARA_EXAME", timestamp: new Date() });
});

// ------- CÓDIGO NOVO (adicionar aqui) -------
app.post('/api/v1/auth/token-teste', (req, res) => {
  const payload = { id: "aluno_123", nome: "Aluno Binario Tech", funcao: "Desenvolvedor" };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
  return res.json({ token });
});

// ------- CÓDIGO ANTIGO (continua abaixo) -------
app.get('/api/v1/simulado/status', autenticar, (req, res) => {
  res.json({ mensagem: "Acesso autorizado no Servidor Local!", usuario: req.usuario });
});
```
Teste (não precisa de login nem de banco para essa rota específica):
```bash
curl -s -X POST http://localhost:3013/api/v1/auth/token-teste | jq .
```
✅ **já no código.**

**Exercício 3 — acessar rota protegida e extrair só o nome com jq**
```bash
TOKEN=$(curl -s -X POST http://localhost:3013/api/v1/auth/token-teste | jq -r '.token')
curl -s http://localhost:3013/api/v1/simulado/status -H "Authorization: Bearer $TOKEN" | jq -r '.usuario.nome'
```
Resultado esperado: `Aluno Binario Tech`.

**Exercício 4 — checar árvore de trabalho limpa**
```bash
cd ~/binario_tech
git status
```
Resultado esperado: `nothing to commit, working tree clean` (depois de dar `git add . && git commit` e `git push` de tudo que estiver pendente).

---

### Aula 18 — Avaliação prática intermediária

> ✅ **corrigido — faltava o `.env` desta pasta.** Como o `.gitignore` da raiz do projeto ignora todo `.env` (de propósito, é boa prática), ele não veio dentro do ZIP/repositório original. Sem ele, `process.env.JWT_SECRET` ficava `undefined` e o `jwt.sign(...)` quebrava com erro ao tentar fazer login. Já incluí o `.env` pronto dentro do `binario_tech_correcoes.zip` (é só extrair, como qualquer outro arquivo do pacote):
> ```
> PORT=3013
> MONGO_URI=mongodb://127.0.0.1:27017/binario_tech_prova
> JWT_SECRET=binario_tech_chave_oficial_exame_2026
> ```
> Também vale notar: o `src/config/database.js` tem um endereço fixo de reserva (`10.85.198.243`), que é o IP interno do Mongo **da rede da sala de aula**, usado só se o `.env` não existir — como agora ele existe (com `127.0.0.1`), esse IP fixo não entra em ação. Se rodar dentro da rede da sala e quiser usar o Mongo de lá em vez do Docker local, é só trocar o `MONGO_URI` do `.env` pelo IP da sala.

**Preparação:**

```bash
docker run -d -p 27017:27017 --name mongo-simulado mongo:latest
cd ~/binario_tech/aula18
npm install
# .env já incluído no binario_tech_correcoes.zip — se ainda não aplicou, extraia o zip primeiro
node server.js &
```

`src/models/Usuario.js` (`email` único, `senha` — o hash). `src/middlewares/validarJWT.js` no mesmo padrão das aulas anteriores (401 sem token, 403 com token inválido). `src/controllers/authController.js` com `register`, `login` e `relatorio`. Tudo já ligado em `src/routes/provaRoutes.js` e `server.js`.

**Questão 1 — registro com hash bcrypt (salt 10)**
```bash
curl -s -X POST http://localhost:3013/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "candidato@binariotech.com.br", "senha": "123" }' | jq .
# {"status":"ERRO","mensagem":"A senha deve conter no mínimo 6 caracteres."}

curl -s -X POST http://localhost:3013/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "candidato@binariotech.com.br", "senha": "SenhaForte123" }' | jq .
# {"status":"SUCESSO","mensagem":"Usuário registrado com sucesso!","usuarioId":"..."}
```
✅ **já no código.**

**Questão 2 — login com JWT de 30 minutos**
```bash
curl -s -X POST http://localhost:3013/api/v1/prova/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "candidato@binariotech.com.br", "senha": "SenhaForte123" }' | jq .
```
✅ **já no código** — `{ id: usuario._id, email: usuario.email }`, `expiresIn: '30m'`.

**Questão 3 — `validarJWT.js` (401 sem token / 403 com token inválido)**
```bash
curl -i http://localhost:3013/api/v1/prova/relatorio                                              # sem token -> 401
curl -i http://localhost:3013/api/v1/prova/relatorio -H "Authorization: Bearer token_falso"         # inválido -> 403
curl -s http://localhost:3013/api/v1/prova/relatorio -H "Authorization: Bearer $TOKEN" | jq .        # válido -> 200
```
✅ **já no código.**

**Questão 4 — `testar_prova.sh`**

Registra, loga, guarda o token e acessa `/relatorio`:
```bash
bash testar_prova.sh
```
✅ **já no código.**

---

### Aula 19 — PM2 e gerenciamento de processos

**Preparação:**

```bash
cd ~/binario_tech && mkdir -p aula19 && cd aula19
npm init -y
npm install express dotenv
npm install -g pm2
```

> **Se o `npm install -g pm2` der erro de permissão (`EACCES`), ou se depois de instalar o `pm2` ainda aparecer `command not found`:** configure uma pasta de instalação global dentro da sua home (foi exatamente isso que o `.npmrc` da sua aula 19 fez: `prefix=/home/.../.npm-global`) e coloque ela no PATH:
> ```bash
> mkdir -p ~/.npm-global
> npm config set prefix ~/.npm-global
> echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
> source ~/.bashrc
> npm install -g pm2
> pm2 -v
> ```
> Se o `pm2 -v` mostrar a versão, está pronto. No **Google Cloud Shell** isso ainda ajuda por outro motivo: ele só mantém a sua pasta home entre uma sessão e outra — o que é instalado fora dela (como o `nginx`, via `apt`) pode sumir quando o Cloud Shell é reiniciado, mas o que está em `~/.npm-global` fica. Se o `pm2` ou o `nginx` sumirem de um dia pro outro, é só instalar de novo.

`server.js` expõe `/api/v1/telemetria/status` (uptime, PID) e `/api/v1/telemetria/crash` (loga o erro, devolve `500` e derruba o processo com `process.exit(1)` depois de 1s — para testar a recuperação automática do PM2).

```bash
pm2 start server.js --name "api-telemetria"
pm2 list
pm2 logs api-telemetria
pm2 monit
```

**Teste de resiliência (recuperação automática após crash):**
```bash
curl -s http://localhost:3013/api/v1/telemetria/crash | jq .
pm2 list   # o contador de "restarts" deve subir e o status voltar para "online"
```
Testei isso de verdade (derrubando o processo com `/crash` e olhando o `pm2 jlist`): o contador de restart realmente sobe de `0` para `1` e o processo volta sozinho — o PM2 está fazendo exatamente o que devia.

**Exercício 1 — `--max-memory-restart 100M` via flag**
```bash
pm2 delete api-telemetria
pm2 start server.js --name "api-telemetria" --max-memory-restart 100M
```
Testado e funcionando.

**Exercício 2 — `ecosystem.config.js` com dev/prod**

✅ **já no código** — só um detalhe: o exercício 1 pede especificamente `100M` via flag, mas no `ecosystem.config.js` você consolidou os dois exercícios usando `max_memory_restart: '200M'` (dev) e `'500M'` (prod) em vez de `100M`. Funciona igual (mesmo mecanismo), só não é o valor exato do enunciado — se a prova cobrar o número certo, é só trocar para `'100M'` no app `api-telemetria-dev`. Testei o arquivo inteiro rodando `pm2 start ecosystem.config.js`: os dois processos (`api-telemetria-dev` na 3013, `api-telemetria-prod` na 8013) sobem e respondem normalmente.
```bash
pm2 start ecosystem.config.js
curl -s http://localhost:3013/api/v1/telemetria/status | jq .
curl -s http://localhost:8013/api/v1/telemetria/status | jq .
```

**Exercício 3 — `pm2 save` + persistir a lista**

✅ **já no código**, em `processos.sh` (roda `pm2 save`, espera, e grava `pm2 status` em `processos.log`). Testado e funciona.
```bash
bash processos.sh
```
> Nota: o script usa caminhos absolutos fixos (`/home/gabriel.barbosa/binario_tech/aula19/...`). Se rodar em outra máquina/usuário, ajuste esse caminho ou rode o script de dentro da própria pasta `aula19` com caminho relativo (`./processos.log`).

**Exercício 4 — commit e push da aula19**
```bash
cd ~/binario_tech
git add aula19
git commit -m "feat: gerenciamento de processos com PM2 - aula19"
git push origin main
```

✅ **corrigido — bug no `monitorar_pm2.sh` (script à parte, não é um dos 4 exercícios, mas está na pasta).** A linha original que lia o contador de restarts estava assim:
```bash
RESTARTS=$(pm2 jlist | jq -r '.[0].pm2_env_restart_time')   # ERRADO — faltava o ponto
```
Testei isso rodando o PM2 de verdade: como não existe nenhuma chave chamada literalmente `pm2_env_restart_time` no JSON do `pm2 jlist` (o campo `restart_time` fica **dentro** do objeto `pm2_env`), o `jq` sempre devolvia `null`, então o script sempre mostrava `Contador de Restarts: null`, mesmo depois de vários crashes de verdade. A correção (já aplicada no `binario_tech_correcoes.zip`) — faltava o ponto entre `pm2_env` e `restart_time`:
```bash
RESTARTS=$(pm2 jlist | jq -r '.[0].pm2_env.restart_time')   # CERTO
```
Testei os dois lado a lado depois de um crash provocado: com o ponto, retornou `1` (o valor certo); sem o ponto, retornou `null`.

> Nota extra sobre esse mesmo script: a linha `pm2 restart api-telemetria` no final só funciona se o processo tiver sido iniciado com esse nome exato (Passo 6, `pm2 start server.js --name "api-telemetria"`). Se você estiver usando o `ecosystem.config.js` do exercício 2, os nomes reais são `api-telemetria-dev` e `api-telemetria-prod` — troque o nome nessa linha para o que estiver rodando de fato (confira com `pm2 list`).

---

### Aula 20 — Proxy Reverso com Nginx

**Preparação (no servidor Linux da sala, via SSH):**

```bash
ssh usuario_aluno@192.168.X.X
cd ~/binario_tech
git pull origin main
mkdir -p aula20/src && cd aula20
```

**Instalar o Nginx (se ainda não estiver instalado no servidor da sala):**
```bash
nginx -v
```
Se aparecer a versão (ex: `nginx version: nginx/1.24.0`), já está instalado — pode pular pro próximo bloco. Se der `comando não encontrado`, instale (testei este comando de instalação num Ubuntu de verdade e funcionou):
```bash
sudo apt update
sudo apt install -y nginx
```
**Subir e controlar o Nginx — depende de onde você está rodando:**

*Se o `sudo systemctl status nginx` funcionar (servidor Linux "de verdade"):*
```bash
sudo systemctl status nginx     # ver se está ativo
sudo systemctl start nginx      # subir
sudo systemctl reload nginx     # recarregar a configuração
```

*Se der o erro `System has not been booted with systemd as init system` (é o caso do **Google Cloud Shell**, que é um container sem systemd):* o `systemctl` não funciona, mas dá pra controlar o Nginx direto pelo comando `nginx`. **Use estes no lugar do `systemctl` em toda a aula 20:**
```bash
sudo nginx                # subir o Nginx
sudo nginx -t             # testar a sintaxe da configuração
sudo nginx -s reload      # recarregar a configuração (substitui o "systemctl reload nginx")
sudo nginx -s stop        # parar
ps aux | grep nginx       # conferir se está rodando (deve aparecer "master process" e "worker process")
```
✅ **testei esses comandos de verdade** num ambiente sem systemd (igual ao Cloud Shell): `nginx` sobe, `nginx -s reload` recarrega e o proxy passa a responder na porta 8080.

> **Se o `sudo nginx` falhar com** `socket() [::]:80 failed (97: Address family not supported by protocol)`**:** o site padrão do Nginx tenta escutar em IPv6 e o ambiente não suporta. Isso aconteceu no meu ambiente de teste e a solução que funcionou foi remover o site padrão, que não é usado nesta aula (a aula usa a porta 8080 no arquivo `binario_aluno.conf`, sem IPv6):
> ```bash
> sudo rm /etc/nginx/sites-enabled/default
> sudo nginx -t && sudo nginx
> ```
> Se o seu `sudo nginx` subir sem erro, ignore este aviso.

> Onde a aula fala `sudo systemctl reload nginx`, troque por `sudo nginx -s reload` se estiver no Cloud Shell. Na primeira vez, se o Nginx ainda não estiver rodando, use `sudo nginx` (o reload só funciona com o Nginx já no ar).

`package.json`:
```json
{
  "name": "aula20-nginx-proxy",
  "version": "1.0.0",
  "description": "Proxy Reverso com Nginx e Express - Binário Tech",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```
```bash
npm install
```

`server.js` — API interna, só acessível via `127.0.0.1:3013` (o Nginx é quem expõe pra fora, na 8080):
```js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3013;

app.use(express.json());

app.get('/api/v1/proxy/info', (req, res) => {
  res.json({
    status: "SUCESSO",
    mensagem: "Requisição processada pelo Express via Nginx Proxy!",
    clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    hostHeader: req.headers['host'],
    portaInternaNode: PORT,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`[Binário Tech] API Interna de Proxy rodando na porta ${PORT}`);
});
```
```bash
pm2 start server.js --name "api-proxy-node"
pm2 list
```
> **Porta 3013 já pode estar ocupada:** as aulas 02 a 19 também usam a 3013 (a aula 19 deixa `api-telemetria` rodando no PM2). Se o `api-proxy-node` ficar `errored` no `pm2 list` ou o log mostrar `EADDRINUSE`, tem algo antigo na 3013. Veja com `pm2 list` e limpe com `pm2 delete api-telemetria` (ou `pm2 delete all`); para servidores soltos em segundo plano, `ps aux | grep node` e `kill <PID>`.

Arquivo do Nginx, `/etc/nginx/sites-available/binario_aluno.conf`:
```nginx
server {
    listen 8080;
    server_name localhost;

    location /api/v1/proxy/ {
        proxy_pass http://127.0.0.1:3013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'keep-alive';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

> **Testei isso de verdade** (instalei um Nginx num ambiente Linux e montei o cenário inteiro): só criar o arquivo em `sites-available` **não é suficiente** — confirmei que dá `000` (conexão recusada) na porta 8080 se parar por aí. Esse diretório é só um "estoque" de configurações; o Nginx só carrega o que está em `sites-enabled`. É preciso criar o link simbólico:
> ```bash
> sudo ln -s /etc/nginx/sites-available/binario_aluno.conf /etc/nginx/sites-enabled/binario_aluno.conf
> ```
> (se o servidor da sala já vier configurado de outro jeito, ou se esse link já existir, ignore esse passo.) Com o link criado, testei de novo: o `curl` na porta 8080 passa a devolver o JSON do Node normalmente — a única diferença entre "não funciona" e "funciona" foi exatamente esse link.

```bash
sudo nginx -t
sudo nginx -s reload      # ou: sudo systemctl reload nginx
curl -s http://localhost:8080/api/v1/proxy/info | jq .
```

`testar_nginx.sh`:
```bash
#!/bin/bash
echo "=================================================="
echo "    AUDITORIA DE PROXY REVERSO NGINX - BINÁRIO TECH"
echo "=================================================="

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/proxy/info)

echo "Testando acesso via Nginx na porta 8080..."
echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "\n[OK] Proxy Reverso Nginx encaminhando tráfego com sucesso!"
else
  echo -e "\n[ERRO] Falha no redirecionamento. Verifique se o PM2 e o Nginx estão ativos."
fi
echo "=================================================="
```
```bash
chmod +x testar_nginx.sh
./testar_nginx.sh
```

**Exercício 1 — bloco `/status-nginx` respondendo direto pelo Nginx (sem passar pelo Node)**

Dentro do arquivo `/etc/nginx/sites-available/binario_aluno.conf`, dentro do `server { }`:
```nginx
# ------- CÓDIGO ANTIGO (já existe) -------
server {
    listen 8080;
    server_name localhost;

    location /api/v1/proxy/ {
        proxy_pass http://127.0.0.1:3013;
        # ... resto já existente ...
    }

# ------- CÓDIGO NOVO (adicionar aqui, dentro do mesmo server{}) -------
    location /status-nginx {
        default_type application/json;
        return 200 '{"status":"ONLINE","servico":"Nginx Binario Tech"}';
    }
}
```
```bash
sudo nginx -t && sudo nginx -s reload      # (ou systemctl reload nginx, fora do Cloud Shell)
curl -s http://localhost:8080/status-nginx | jq .
```
Resultado esperado: `{"status":"ONLINE","servico":"Nginx Binario Tech"}` com `200`, mesmo se o Node (porta 3013) estiver derrubado — é o Nginx respondendo sozinho. ✅ **testei os dois cenários** (Node no ar e Node derrubado) e bateu certinho nos dois.

**Exercício 2 — limitar o tamanho do corpo da requisição**
```nginx
# ------- CÓDIGO ANTIGO (já existe) -------
server {
    listen 8080;
    server_name localhost;

# ------- CÓDIGO NOVO (adicionar logo abaixo) -------
    client_max_body_size 2M;

# ------- CÓDIGO ANTIGO (continua abaixo) -------
    location /api/v1/proxy/ {
        proxy_pass http://127.0.0.1:3013;
        ...
    }
}
```
```bash
sudo nginx -t && sudo nginx -s reload      # (ou systemctl reload nginx, fora do Cloud Shell)
```
Teste (gera um arquivo de 3 MB só pra esse teste, maior que o limite de 2M, e apaga depois):
```bash
dd if=/dev/zero of=/tmp/payload_grande.txt bs=1M count=3
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8080/api/v1/proxy/info \
  --data-binary @/tmp/payload_grande.txt -H "Content-Type: application/octet-stream"
rm /tmp/payload_grande.txt
```
Resultado esperado: `413` (Request Entity Too Large). ✅ **testei** com um arquivo de 3 MB de verdade — deu exatamente `413`.

**Exercício 3 — `analisar_logs_nginx.sh`**
```bash
nano analisar_logs_nginx.sh
```
```bash
#!/bin/bash
echo "Últimas requisições com status 200 OK:"
tail -n 15 /var/log/nginx/access.log | grep '" 200 '
```
> O formato padrão de log do Nginx (`combined`) escreve a linha mais ou menos assim: `... "GET /api/v1/proxy/info HTTP/1.1" 200 123 ...` — por isso o `grep '" 200 '` funciona: pega o status logo depois das aspas que fecham a URL.
```bash
chmod +x analisar_logs_nginx.sh
./analisar_logs_nginx.sh
```
✅ **testei** — gerei requisições com 200, 404, 413 e 502 misturadas no log, e o script filtrou certinho, mostrando só as de 200. Se der erro de permissão lendo `/var/log/nginx/access.log`, rode com `sudo ./analisar_logs_nginx.sh` (esse log geralmente só é legível por root ou pelo grupo `adm`).

**Exercício 4 — versionar a aula 20**

> Atenção: o arquivo do Nginx (`/etc/nginx/sites-available/binario_aluno.conf`) mora **fora** da pasta `binario_tech` — é um arquivo de sistema, não faz parte do repositório Git. Só o que está dentro de `~/binario_tech/aula20` é versionado.
```bash
cd ~/binario_tech
git add aula20
git commit -m "feat: proxy reverso com nginx - aula20"
git push origin main
```

**Como levar o Nginx para o servidor da escola**

O `/etc/nginx` é do sistema: não vai no `git push`, e o Nginx não vem junto com a pasta do projeto. No servidor da escola você precisa (1) ter o Nginx instalado e (2) recriar o arquivo `.conf`. Para não depender de digitar tudo de novo, guarde uma cópia do `.conf` dentro da pasta `aula20`, que o Git leva.

No Cloud Shell (onde o arquivo já está pronto):
```bash
cd ~/curso-pbe1/binario_tech/aula20
mkdir -p nginx
cp /etc/nginx/sites-available/binario_aluno.conf nginx/binario_aluno.conf
cd ..
git add aula20
git commit -m "feat: copia do conf do nginx - aula20"
git push origin main
```

No servidor da escola:
```bash
cd ~/binario_tech
git pull origin main
nginx -v                                   # já tem Nginx? se não: sudo apt update && sudo apt install -y nginx
cd aula20
npm install
pm2 start server.js --name "api-proxy-node"
sudo cp nginx/binario_aluno.conf /etc/nginx/sites-available/binario_aluno.conf
sudo ln -sf /etc/nginx/sites-available/binario_aluno.conf /etc/nginx/sites-enabled/binario_aluno.conf
sudo nginx -t
sudo systemctl reload nginx                # se der erro de systemd: sudo nginx -s reload (ou sudo nginx, se ainda não estiver rodando)
./testar_nginx.sh
```
✅ **testei a parte de copiar o `.conf` do repositório para `/etc/nginx`, ativar e chamar** (`/status-nginx` deu `200`). Não testei o servidor da escola em si, porque não tenho acesso a ele.

Confira antes, no servidor da escola:
- `nginx -v` mostra a versão? Se não, precisa instalar (`sudo apt install -y nginx`).
- `sudo -v` pede sua senha e aceita? Se der "user is not in the sudoers file", você não tem permissão de administrador e não consegue editar o `/etc/nginx`. Nesse caso, peça ao professor para liberar, já que o plano de aula dele usa `sudo nano /etc/nginx/...`.
- A cópia em `aula20/nginx/` é só um backup. Se você mudar o arquivo em `/etc/nginx/sites-available/`, copie de volta para o repositório e faça commit.

---

### Aula 21 — CI/CD Local e Automação de Deploy

**Preparação:**

```bash
ssh usuario_aluno@192.168.X.X
cd ~/binario_tech
git pull origin main
mkdir -p aula21/src && cd aula21
```

`package.json`:
```json
{
  "name": "aula21-cicd-deploy",
  "version": "1.0.0",
  "description": "Automação de Deploy Contínuo - Binário Tech",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```
```bash
npm install
```

`server.js`:
```js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3013;

app.use(express.json());

app.get('/api/v1/versao', (req, res) => {
  res.json({
    aplicacao: "API Binário Tech - CI/CD Pipeline",
    versao: "1.0.0",
    ambiente: "Servidor de Homologação Local",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`[Binário Tech] Aplicação CI/CD ativa na porta ${PORT}`);
});
```
```bash
pm2 start server.js --name "api-cicd"
pm2 list
```
> **Porta 3013 compartilhada com a aula 20:** o `api-proxy-node` da aula 20 usa a mesma 3013. Os dois não podem ficar rodando ao mesmo tempo. Antes de subir o `api-cicd`, pare o da aula 20 com `pm2 delete api-proxy-node` (confira com `pm2 list`). Se esquecer, o `api-cicd` fica `errored` com `EADDRINUSE`. Do outro lado, com a aula 21 na 3013 e o Nginx da aula 20 ainda no ar, o `./testar_nginx.sh` da aula 20 passa a dar `404`, porque a API da aula 21 não tem a rota `/api/v1/proxy/info`.

> ⚠️ **importante — o PM2 tem que estar instalado globalmente (`npm install -g pm2`, feito lá na aula 19), não local dentro da pasta `aula21`.** Testei o cenário de instalar local por engano (`npm install pm2` sem `-g`, direto na pasta do projeto) e o `deploy.sh` quebrava: o passo `[2/4]` do próprio script (`npm install --production`) apaga o `pm2` da pasta `node_modules`, porque ele não está listado no `package.json` (o npm remove qualquer pacote "extra" que não conste nas dependências). Depois disso, todo `pm2 restart` dentro do script passa a dar `pm2: command not found`. Com o PM2 instalado globalmente (como já deve estar desde a aula 19), esse problema não existe, porque `npm install --production` só mexe no `node_modules` local do projeto, nunca nos pacotes globais.

`deploy.sh` — o pipeline em si: puxa código novo, instala dependências, reinicia no PM2 e faz um *smoke test*; se o teste falhar, mostra os logs e sai com erro (código 1), sem marcar sucesso:
```bash
#!/bin/bash
echo "=================================================="
echo "    PIPELINE DE DEPLOY AUTOMATIZADO - BINÁRIO TECH"
echo "=================================================="

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"   # raiz do repositório, não importa onde ele está
APP_NAME="api-cicd"
PORT=3013

echo "[1/4] Atualizando código-fonte do repositório remoto..."
cd $REPO_DIR
git pull origin main

echo "[2/4] Verificando e instalando novas dependências..."
cd $REPO_DIR/aula21
npm install --production

echo "[3/4] Reiniciando aplicação no PM2..."
pm2 restart $APP_NAME

echo "[4/4] Executando Smoke Test na API (Porta $PORT)..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/v1/versao)

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "\n[SUCESSO] Deploy realizado e verificado com sucesso! HTTP Status 200."
  pm2 list | grep $APP_NAME
else
  echo -e "\n[FALHA] Smoke Test falhou com status $HTTP_STATUS! Verifique os logs do PM2."
  pm2 logs $APP_NAME --lines 20
  exit 1
fi
echo "=================================================="
```
```bash
chmod +x deploy.sh
./deploy.sh
```
> ⚠️ **caminho do repositório:** o roteiro do professor usa `REPO_DIR="$HOME/binario_tech"`, que só vale se o repositório estiver exatamente em `~/binario_tech` (é o caso do servidor da escola). No Cloud Shell ele fica em `~/curso-pbe1/binario_tech`, e aí o `cd` falha com `No such file or directory` (`cd: /home/.../binario_tech: No such file or directory`). O script ainda pode "dar certo" se você rodar de dentro da `aula21`, porque o `git pull` e o `npm install` acabam rodando na pasta atual, mas ele fica errado (e o `deploy_history.log` do exercício 2 iria para o lugar errado). Por isso a linha do `REPO_DIR` acima calcula a raiz a partir do local do próprio script (`aula21/..`), e funciona nos dois ambientes e também quando o script é chamado pelo hook. Testei essa linha rodando o script de dentro da `aula21`, da raiz do repo e de outra pasta, e o `REPO_DIR` deu o mesmo caminho nos quatro casos.


**Exercício 1 — mudar a versão, commitar e rodar o deploy**
```bash
# editar server.js: trocar "versao": "1.0.0" por "versao": "1.0.1"
git add aula21/server.js
git commit -m "chore: bump versao para 1.0.1"
cd aula21
./deploy.sh
curl -s http://localhost:3013/api/v1/versao | jq '.versao'
```
Resultado esperado: `"1.0.1"`.
> Repare que quem realmente aplica a mudança é o `pm2 restart` dentro do `deploy.sh` (ele recarrega o `server.js` com o código novo que já está salvo em disco) — o `git commit` aqui serve só pra manter o histórico do projeto, não é ele que "aplica" a versão nova.

✅ **testei esse fluxo inteiro de ponta a ponta** (editar, commitar, rodar `deploy.sh`, checar via curl) e o `/api/v1/versao` passou a responder `"1.0.1"` depois do deploy.

**Exercício 2 — gravar `deploy_history.log` a cada deploy**

Duas partes dentro de `deploy.sh`: guardar o hash do commit logo após o `git pull`, e gravar a linha do log só quando o deploy é bem-sucedido.
```bash
# ------- CÓDIGO ANTIGO (já existe) -------
echo "[1/4] Atualizando código-fonte do repositório remoto..."
cd $REPO_DIR
git pull origin main

# ------- CÓDIGO NOVO (adicionar logo abaixo do git pull) -------
COMMIT_HASH=$(git rev-parse --short HEAD)
```
```bash
# ------- CÓDIGO ANTIGO (já existe, dentro do "if" de sucesso) -------
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo -e "\n[SUCESSO] Deploy realizado e verificado com sucesso! HTTP Status 200."
  pm2 list | grep $APP_NAME

# ------- CÓDIGO NOVO (adicionar logo abaixo) -------
  echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy com sucesso - Commit: $COMMIT_HASH" >> $REPO_DIR/aula21/deploy_history.log

# ------- CÓDIGO ANTIGO (continua, fecha o if) -------
else
  echo -e "\n[FALHA] Smoke Test falhou com status $HTTP_STATUS! Verifique os logs do PM2."
  pm2 logs $APP_NAME --lines 20
  exit 1
fi
```
Teste (não afeta o exercício 1, só acrescenta uma linha nova no log a cada deploy):
```bash
./deploy.sh
cat deploy_history.log
```
✅ **testei** — cada deploy bem-sucedido gravou uma linha assim: `2026-09-26 21:41:49 - Deploy com sucesso - Commit: a3a17fe`.

**Exercício 3 — Git Hook `post-commit` disparando o deploy sozinho**
```bash
cd ~/binario_tech
nano .git/hooks/post-commit
```
```bash
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" == "main" ]; then
  echo "Commit detectado na branch main. Disparando deploy automático em segundo plano..."
  cd "$(git rev-parse --show-toplevel)/aula21" && nohup bash deploy.sh > deploy_hook.log 2>&1 &
fi
```
```bash
chmod +x .git/hooks/post-commit
```
> ⚠️ **testei isso de verdade e achei um risco real: rodar o `deploy.sh` de forma síncrona dentro do hook (sem o `nohup ... &` acima) trava o `git commit` até o deploy inteiro terminar.** Na maior parte das vezes o deploy é rápido (poucos segundos), mas numa das minhas execuções o `pm2 restart` demorou muito mais que o normal e prendeu o terminal por vários minutos, esperando o commit "terminar". Por isso troquei a última linha do hook para rodar o `deploy.sh` **em segundo plano** (`nohup ... > deploy_hook.log 2>&1 &`) — assim o `git commit` retorna na hora (testei e confirmei: 0 segundos), não importa quanto tempo o deploy leve por trás. O resultado do deploy fica registrado em `aula21/deploy_hook.log` pra você conferir depois.

> **Atenção — isso só dispara em commits feitos DIRETO no servidor da sala.** Um hook `post-commit` roda no momento do comando `git commit`, no repositório onde ele está instalado. Testei os dois cenários pra confirmar: se você editar um arquivo no Google Cloud Shell, commitar lá e depois só der `git pull` no servidor da sala (o fluxo que a gente usa desde a aula 16) — mesmo um `git pull` que traz o commit novo — o hook **não dispara**, confirmei isso na prática. Só dispara com um `git commit` de verdade rodado ali, dentro do servidor da sala:
```bash
# ainda no servidor da sala, dentro de ~/binario_tech
echo "teste do hook" >> aula21/README_teste.txt
git add aula21/README_teste.txt
git commit -m "test: disparo do hook post-commit"
# o commit deve voltar na hora; o deploy roda em segundo plano — confira com: cat deploy_hook.log
```

**Exercício 4 — versionar a aula 21**
```bash
cd ~/binario_tech
git add aula21/server.js aula21/deploy.sh aula21/package.json
git commit -m "feat: pipeline de deploy automatizado com pm2 - aula21"
git push origin main
```

---

## 5. Observações finais para a prova

**Resumo dos bugs que existiam no projeto original e já foram corrigidos** (via `binario_tech_correcoes.zip`) — vale saber o que era, porque se a prova pedir pra montar uma dessas aulas do zero, é fácil cair no mesmo erro de novo:

| Aula | Problema que existia | Efeito que dava |
|---|---|---|
| 07 | `require('../middleware/validaVin')` com caminho errado + `mercedesRoutes.js` sem `module.exports` | o servidor nem subia |
| 08 | `testar_banco.sh` com `Content-Type: application.json` (typo) no passo 2 | esse passo específico do script dava 400 em vez de 201 |
| 09 | `registrarLeitura` inseria `latitude`/`longitude`/`data_hora`, que não existem na tabela | `POST /telemetria` sempre dava 500 |
| 13 | `validarRequisicao.js` tinha sido sobrescrito com a lógica de Content-Type em vez do `validationResult` | payload inválido retornava 201 em vez de 422 |
| 17 | `testar_simulado.sh` testava a porta 3000 em vez de 3013 | o script sempre gravava `000` no log |
| 18 | faltava o `.env` na pasta (correto, está no `.gitignore`) | login quebrava sem `JWT_SECRET` |
| 19 | `monitorar_pm2.sh` usava `pm2_env_restart_time` (sem ponto) em vez de `pm2_env.restart_time` | o contador de restarts sempre aparecia como `null` |

> A aula 10 não entra nessa lista porque não era um bug — só uma diferença de nome entre as rotas do seu código (`/frota/relatorio`, `/frota/veiculo-teste`) e o `testar_aula10.sh` salvo (que ainda chama `/frota` e `/frota/veiculo`). O código sempre funcionou, só com nomes diferentes — segue explicado na seção da aula 10.

**Se a prova pedir para refazer uma aula do zero, a ordem de ouro é:**

1. Ler o enunciado com calma e identificar: é API em memória (Express puro), SQLite (Knex) ou MongoDB (Mongoose)?
2. Montar a estrutura de pastas (`src/controllers`, `src/routes`, etc. a partir da aula 07).
3. Escrever primeiro o `server.js`/rota básica e confirmar que sobe (`node server.js`) antes de implementar a lógica de negócio.
4. Implementar o controller com o retorno de status code certo (ver a tabela da seção 3.2).
5. Testar cada rota com `curl`/`jq` conforme for escrevendo — não esperar terminar tudo para testar.
6. Só then rodar o script de auditoria/teste da aula, se houver um.
7. `git add . && git commit -m "..." && git push origin main`.

**Erros de digitação que valem a pena revisar de cabeça, porque já apareceram mais de uma vez neste projeto:**
- `application/json` (barra) vs `application.json` (ponto) no header `Content-Type`.
- `middleware` (singular) vs `middlewares` (plural) no nome da pasta — confira sempre o nome real da pasta antes de escrever o `require`.
- Esquecer o `module.exports = router;` no final de um arquivo de rotas.
- Em objetos de acesso encadeado no `jq`/JS (`pm2_env.restart_time`, por exemplo), o ponto faz diferença — sem ele, vira o nome de uma chave que não existe.
