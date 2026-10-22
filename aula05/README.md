# Aula 05 - API Binário Tech (Middlewares, Rotas e Segurança)

API em Node.js + Express rodando na porta **3007**.
Chave de API usada nos testes: `binario-tech-secret-2026` (header `X-API-KEY`).

Para subir o servidor (deixe esta aba aberta e use outra para os testes):

```bash
cd ~/curso-pbe1/binario_tech/aula05
npm install
node app.js
```

---

## Exercício 01 - GET em `/health` e log do `loggerMiddleware`

**Passo 1.** Com o servidor rodando, em outro terminal:

```bash
curl -i http://localhost:3007/api/v1/health
```

**Passo 2.** Veja no terminal do servidor a linha gerada pelo `loggerMiddleware`.

**Observação:** a rota correta é `/api/v1/health` (em `/health` o retorno é 404).

Código do middleware (`middlewares/logger.js`):

Registro no `app.js`, antes das rotas: `app.use(loggerMiddleware);`

---

## Exercício 02 - Rota `routes/manutencoes.js`

Rotas para **listar (GET)** e **cadastrar (POST)** orçamentos de manutenção.

Código (`routes/manutencoes.js`):

Teste:

```bash
curl -i http://localhost:3007/api/v1/manutencoes -H "X-API-KEY: binario-tech-secret-2026"

curl -i -X POST http://localhost:3007/api/v1/manutencoes \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"caminhaoPlaca": "ABC-1234", "descricao": "Revisão dos freios", "valorOrcamento": 980.5}'
```

Resultado esperado: GET `200 OK` e POST `201 Created`.

---

## Exercício 03 - Registrar o roteador no `app.js` com `authMiddleware`

Linha no `app.js`:

```js
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);
```

Código do `authMiddleware` (`middlewares/auth.js`):

Teste:

```bash
# Sem chave: deve retornar 401
curl -i http://localhost:3007/api/v1/manutencoes

# Com chave: deve retornar 200
curl -i http://localhost:3007/api/v1/manutencoes -H "X-API-KEY: binario-tech-secret-2026"
```

---

## Exercício 04 - Middleware `middlewares/validaCnh.js`

Garante que a CNH do POST tenha exatamente 11 dígitos numéricos.

Código:

Uso em `routes/motoristas.js`:

Teste:

```bash
# CNH com 10 dígitos: 400
curl -i -X POST http://localhost:3007/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos", "cnh": "1234567890", "categoria": "E"}'

# CNH com letra: 400
curl -i -X POST http://localhost:3007/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos", "cnh": "1234567890A", "categoria": "E"}'

# CNH válida: 201
curl -i -X POST http://localhost:3007/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos", "cnh": "12345678901", "categoria": "E"}'
```

---

## Exercício 05 - `validaCnh` apenas no POST + teste com CNH inválida

**Passo 1.** Confirmar que o middleware está só no POST:

```bash
grep -n "validaCnh" routes/motoristas.js app.js
```

Esperado: ocorrências em `routes/motoristas.js` (require e `router.post`) e nenhuma em `app.js`.

**Passo 2.** Testar com CNH inválida (`"123"`):

```bash
curl -i -X POST http://localhost:3007/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Carlos", "cnh": "123", "categoria": "E"}'
```

Resultado esperado: `HTTP/1.1 400 Bad Request` com a mensagem de CNH inválida.

**Passo 3.** Provar que o GET não é afetado:

```bash
curl -i http://localhost:3007/api/v1/motoristas -H "X-API-KEY: binario-tech-secret-2026"
```

Resultado esperado: `200 OK`.

---

## Exercício 06 - 404 global em JSON padronizado

Handler no final do `app.js`, depois de todas as rotas:

```js
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech" });
});
```

Teste:

```bash
curl -i http://localhost:3007/api/v1/clientes
```

Resultado esperado:

```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"erro":"Endpoint nao encontrado no servidor Binario Tech"}
```

---

## Exercício 07 - Script `teste_seguranca.sh`

Simula 3 tentativas sem chave (esperado 401) e 1 com chave válida (esperado 200), salvando os retornos em `audit_seguranca.log`.

Código (`teste_seguranca.sh`):

Execução:

```bash
chmod +x teste_seguranca.sh
rm -f audit_seguranca.log
./teste_seguranca.sh
cat audit_seguranca.log
```

Resultado esperado: três `HTTP_STATUS:401` e um `HTTP_STATUS:200`.

---

## Exercício 08 - Encontrar o processo da API e encerrá-lo

**Passo 1.** Encontrar o PID (segunda coluna; ignore a linha do próprio `grep`):

```bash
ps aux | grep node
```

**Passo 2.** Encerrar o processo (troque `<PID>` pelo número encontrado):

```bash
kill -9 <PID>
```

**Passo 3.** Confirmar que foi encerrado:

```bash
ps aux | grep [n]ode
curl -i http://localhost:3007/api/v1/health
```

Esperado: nenhum processo listado e `curl: (7) Failed to connect to localhost port 3007`.

Dica: para saber qual processo usa a porta 3007, rode `ss -ltnp | grep 3007`.
