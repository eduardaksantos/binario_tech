# Aula 05: Middlewares e Segurança na API de Frota

Guia de consulta rápida para a prova (exercícios 1 a 8).
Repositório: `~/curso-pbe1/binario_tech` | Pasta: `aula05` | Arquivo principal: `app.js`

Estrutura da aula:

```text
aula05/
  app.js                      <- registra middlewares e rotas
  middlewares/
    logger.js                 <- loggerMiddleware (Ex. 1)
    auth.js                   <- authMiddleware, exige chave de API (Ex. 3 e 7)
    validaCnh.js              <- valida CNH com 11 dígitos (Ex. 4 e 5)
  routes/
    motoristas.js             <- POST de motoristas usa validaCnh
    manutencoes.js            <- listar e cadastrar manutenções (Ex. 2)
  teste_seguranca.sh          <- script de auditoria (Ex. 7)
```

## Preparação

Descobrir porta, header da chave de API e rotas:

```bash
cd ~/curso-pbe1/binario_tech/aula05
grep -n "PORT\|listen" app.js
grep -n "app.use\|app.get" app.js
grep -n "header\|headers\|api" middlewares/auth.js
```

Subir a API:

```bash
npm install
node app.js &
```

A `aula21` (processo `api-cicd` no PM2) usa a porta 3007. Se a aula05 usar a mesma porta, pare a outra antes e religue depois:

```bash
pm2 stop api-cicd          # antes
pm2 start api-cicd         # depois
```

Variáveis usadas nos comandos abaixo (ajuste porta, header e chave conforme o `grep` acima):

```bash
BASE="http://localhost:3007/api/v1"
KEY="minha-chave-secreta"
```

Os exemplos usam o header `x-api-key`. Se o `auth.js` ler outro nome de header, troque em todos os comandos. O enunciado cita a porta 3000: use a porta que o `grep` mostrou.

## Exercício 1: GET no health e log do loggerMiddleware

```bash
curl -s $BASE/health | jq .
```

Olhe o terminal onde o `node app.js` está rodando. Deve aparecer uma linha gerada pelo `loggerMiddleware`, com método, rota e hora, por exemplo:

```text
[2026-10-02T03:30:00.000Z] GET /api/v1/health
```

Se a API está em segundo plano (`&`), as mensagens aparecem no mesmo terminal. Exemplo mínimo de `middlewares/logger.js`:

```js
function loggerMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}
module.exports = loggerMiddleware;
```

E no `app.js`: `app.use(loggerMiddleware);` (antes das rotas).

## Exercício 2: routes/manutencoes.js

```js
const express = require('express');
const router = express.Router();

let manutencoes = [];
let proximoId = 1;

// Listar
router.get('/', (req, res) => {
  res.status(200).json(manutencoes);
});

// Cadastrar
router.post('/', (req, res) => {
  const { caminhao, descricao, valor } = req.body;
  if (!caminhao || !descricao || valor === undefined) {
    return res.status(400).json({ erro: "Campos obrigatórios: caminhao, descricao e valor." });
  }
  const nova = { id: proximoId++, caminhao, descricao, valor };
  manutencoes.push(nova);
  res.status(201).json(nova);
});

module.exports = router;
```

Não esqueça o `module.exports = router;`. Sem ele, o servidor não sobe.

## Exercício 3: registrar o roteador no app.js com authMiddleware

```js
const manutencoesRoutes = require('./routes/manutencoes');
const authMiddleware = require('./middlewares/auth');

app.use('/api/v1/manutencoes', authMiddleware, manutencoesRoutes);
```

Ordem em `app.use(caminho, middleware, roteador)`: o middleware roda primeiro e só chama o roteador se liberar.

Testar:

```bash
# sem chave: deve ser bloqueado (401 ou 403)
curl -i $BASE/manutencoes

# com chave: deve listar
curl -s $BASE/manutencoes -H "x-api-key: $KEY" | jq .

# cadastrar
curl -i -X POST $BASE/manutencoes \
  -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"caminhao":"Volvo FH 540","descricao":"Troca de oleo","valor":850}'
```

## Exercício 4: middlewares/validaCnh.js

```js
function validaCnh(req, res, next) {
  const { cnh } = req.body;
  if (!/^\d{11}$/.test(String(cnh))) {
    return res.status(400).json({ erro: "CNH inválida: deve conter exatamente 11 dígitos numéricos." });
  }
  next();
}
module.exports = validaCnh;
```

A expressão `/^\d{11}$/` significa: do início ao fim, exatamente 11 dígitos.

## Exercício 5: aplicar validaCnh só no POST de motoristas

Em `routes/motoristas.js`:

```js
const validaCnh = require('../middlewares/validaCnh');

router.post('/', validaCnh, (req, res) => {
  // ... lógica de cadastro do motorista
});
```

O middleware vai como segundo argumento da rota `POST`, e não em `app.use`. Assim os outros métodos (GET, etc.) não são afetados.

Testar com CNH inválida:

```bash
curl -i -X POST $BASE/motoristas \
  -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nome":"Joao","cnh":"123"}'
```

Esperado: `HTTP/1.1 400 Bad Request` com a mensagem de erro.

Testar com CNH válida (deve passar da validação):

```bash
curl -i -X POST $BASE/motoristas \
  -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"nome":"Joao","cnh":"12345678901"}'
```

## Exercício 6: middleware global de 404 em JSON

No `app.js`, depois de **todas** as rotas e antes do `app.listen`:

```js
app.use((req, res) => {
  res.status(404).json({
    status: "ERRO",
    mensagem: `Rota ${req.method} ${req.originalUrl} não encontrada.`
  });
});
```

Testar:

```bash
curl -i $BASE/clientes
```

Esperado: `404 Not Found` com corpo JSON padronizado. Se a rota estiver protegida por `authMiddleware` global, envie também o header `-H "x-api-key: $KEY"`.

A posição importa: se o 404 ficar antes das rotas, ele intercepta tudo.

## Exercício 7: teste_seguranca.sh com audit_seguranca.log

```bash
#!/bin/bash
BASE="http://localhost:3007/api/v1"
KEY="minha-chave-secreta"
LOG="audit_seguranca.log"
: > "$LOG"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"; }

for i in 1 2 3; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/manutencoes")
  log "Tentativa $i SEM chave: HTTP $CODE"
done

CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/manutencoes" -H "x-api-key: $KEY")
log "Tentativa COM chave valida: HTTP $CODE"

log "Fim da auditoria. Log salvo em $LOG"
```

Rodar:

```bash
chmod +x teste_seguranca.sh
./teste_seguranca.sh
cat audit_seguranca.log
```

Esperado: as 3 primeiras com `401` ou `403`, e a última com `200`. Ajuste `KEY` para o valor que o `auth.js` aceita.

## Exercício 8: encontrar o processo e encerrar com kill -9

```bash
ps aux | grep node
```

Exemplo de saída:

```text
eduarda   5123  0.5  1.2 ... node app.js
eduarda   5190  0.0  0.0 ... grep node
```

O PID é o **segundo campo** da linha do `node app.js` (aqui, `5123`). Ignore a linha do próprio `grep`.

Encerrar:

```bash
kill -9 5123
```

Conferir que parou:

```bash
ps aux | grep node
curl -s -o /dev/null -w "%{http_code}\n" $BASE/health      # deve mostrar 000
```

Opções mais seguras:

```bash
pgrep -f "node app.js"       # mostra só o PID
kill 5123                    # tenta encerrar com educação (SIGTERM)
pkill -f "node app.js"       # encerra pelo nome
```

Cuidado: processos gerenciados pelo PM2 (como o `api-cicd` da aula21) são **recriados automaticamente** se você matar com `kill -9`. Para parar de verdade, use `pm2 stop api-cicd`.

## Tabela de status HTTP da aula

| Código | Significado | Quando |
|---|---|---|
| 200 | OK | leitura com sucesso |
| 201 | Created | POST criou o recurso |
| 400 | Bad Request | dado inválido (CNH, campo faltando) |
| 401 / 403 | Não autorizado / Proibido | sem chave de API ou chave errada |
| 404 | Not Found | rota ou recurso inexistente |

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `Connection refused` / `000` | API fora do ar ou porta errada: `grep -n listen app.js` |
| `EADDRINUSE` | `pm2 stop api-cicd` ou `pkill -f "node app.js"` |
| Servidor não sobe após criar rota | faltou `module.exports = router;` ou o `require` aponta para a pasta errada |
| Sempre 401 | nome do header ou valor da chave diferente do `auth.js` |
| `POST` com CNH inválida retorna 201 | `validaCnh` não foi colocado na rota POST |
| 404 intercepta todas as rotas | o `app.use` do 404 está antes das rotas |
| `req.body` vem `undefined` | falta `app.use(express.json())` antes das rotas |
| `middleware` vs `middlewares` | confira o nome real da pasta antes do `require` |

## Pontos que caem na prova

1. Middleware recebe `(req, res, next)` e chama `next()` para liberar a requisição.
2. A **ordem** do `app.use` define a ordem de execução: logger e `express.json()` primeiro, rotas depois, 404 por último.
3. Middleware específico de rota vai como argumento da rota; global vai em `app.use`.
4. 400 é dado inválido, 401/403 é falta de permissão, 404 é rota inexistente.
5. `kill -9` encerra à força; prefira `kill` (SIGTERM) quando possível.
6. Em `ps aux | grep node`, ignore a linha do próprio `grep`.
7. Não versione `node_modules`, `.env` nem `*.log`.
