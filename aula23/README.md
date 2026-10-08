# Aula 23 - API de Visitas com Redis, Docker Compose e Logs Unificados

Projeto com uma API Node.js (Express) que conta visitas usando Redis. O Redis roda em container com volume persistente, e a API também roda em container, via Docker Compose.

## Estrutura

```
aula23/
├── server.js              # API Express (rotas de visitas)
├── Dockerfile             # imagem da API
├── docker-compose.yml     # serviços api + redis + volume
├── logs_unificados.sh     # script que monitora logs de api e redis
├── evidencia_logs.txt     # evidência da execução do script
├── package.json
└── README.md
```

## Como subir o projeto

```bash
cd ~/curso-pbe1/binario_tech/aula23
docker compose up -d --build
docker compose ps
```

A API fica em `http://localhost:3007`.

---

## Exercício 1 - Rota `DELETE /api/v1/visitas/reset`

**Enunciado:** adicionar em `server.js` uma rota que limpe a chave `contador_visitas` no Redis e retorne confirmação em JSON.

**Explicação:**
- `GET /api/v1/visitas` usa `INCR` para somar 1 ao contador e retorna o valor.
- `DELETE /api/v1/visitas/reset` usa `DEL` para remover a chave `contador_visitas`.
- O `DEL` retorna quantas chaves foram removidas: `1` se a chave existia, `0` se já não existia.
- Os erros são tratados com `try/catch` e retornam status 500.

**Código (`server.js`):**

```javascript
const express = require('express');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3007;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CHAVE_CONTADOR = 'contador_visitas';

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

const redisClient = createClient({ url: REDIS_URL });
redisClient.on('error', (erro) => console.error('Erro no Redis:', erro));

// GET /api/v1/visitas -> incrementa e retorna o contador
app.get('/api/v1/visitas', async (req, res) => {
  try {
    const visitas = await redisClient.incr(CHAVE_CONTADOR);
    res.status(200).json({ visitas });
  } catch (erro) {
    console.error('Erro ao incrementar contador:', erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar visita.' });
  }
});

// DELETE /api/v1/visitas/reset -> limpa a chave contador_visitas
app.delete('/api/v1/visitas/reset', async (req, res) => {
  try {
    const removidas = await redisClient.del(CHAVE_CONTADOR);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Contador de visitas resetado com sucesso.',
      chave: CHAVE_CONTADOR,
      chaves_removidas: removidas
    });
  } catch (erro) {
    console.error('Erro ao resetar contador:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao resetar o contador de visitas.'
    });
  }
});

async function iniciar() {
  await redisClient.connect();
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

iniciar().catch((erro) => {
  console.error('Falha ao iniciar o servidor:', erro);
  process.exit(1);
});
```

**Teste:**

```bash
curl http://localhost:3007/api/v1/visitas
curl http://localhost:3007/api/v1/visitas
curl -X DELETE http://localhost:3007/api/v1/visitas/reset
curl http://localhost:3007/api/v1/visitas
```

**Resultado esperado:** `{"visitas":1}`, `{"visitas":2}`, o JSON de confirmação com `"chaves_removidas":1` e, por fim, `{"visitas":1}` de novo, o que prova que o reset funcionou.

---

## Exercício 2 - Inspecionar o volume do Redis

**Enunciado:** inspecionar o volume com `docker volume inspect aula23_redis_data` e identificar o caminho de montagem no Linux host.

**Explicação:**
- O nome `aula23_redis_data` é formado pelo nome do projeto (`aula23`) mais o volume declarado no compose (`redis_data`).
- O Redis grava seus dados em `/data` dentro do container, e o Docker guarda esses arquivos no host.
- O caminho no host aparece no campo `Mountpoint` do `inspect`.
- Usamos `--appendonly yes` para o Redis gravar os dados em disco (AOF), o que cria a pasta `appendonlydir`.

**Arquivos de suporte.**

`docker-compose.yml`:

```yaml
name: aula23

services:
  redis:
    image: redis:7
    container_name: redis-aula23
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: .
    container_name: api-aula23
    environment:
      PORT: 3007
      REDIS_URL: redis://redis:6379
    ports:
      - "3007:3007"
    depends_on:
      - redis

volumes:
  redis_data:
```

`Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
CMD ["node", "server.js"]
```

**Comandos:**

```bash
docker volume ls
docker volume inspect aula23_redis_data
docker volume inspect aula23_redis_data --format '{{ .Mountpoint }}'
sudo ls -la /var/lib/docker/volumes/aula23_redis_data/_data
```

**Resposta:** o caminho de montagem no host é

```
/var/lib/docker/volumes/aula23_redis_data/_data
```

Dentro do container, esse volume está montado em `/data`.

**Prova de persistência:**

```bash
curl http://localhost:3007/api/v1/visitas
curl http://localhost:3007/api/v1/visitas
docker compose down
docker compose up -d
sleep 3
curl http://localhost:3007/api/v1/visitas
```

Resultado: o contador continua de onde parou, sem voltar para 1. O `docker compose down` remove os containers, mas não o volume. Só o `docker compose down -v` apaga o volume e os dados.

---

## Exercício 3 - Script `logs_unificados.sh`

**Enunciado:** criar um script Bash que use `docker compose logs -f --tail=20` para monitorar os logs combinados da API e do Redis em tempo real.

**Explicação:**
- `logs`: mostra os logs dos serviços do compose.
- `-f` (follow): mantém o terminal aberto, mostrando novas linhas em tempo real.
- `--tail=20`: mostra só as últimas 20 linhas de cada serviço ao iniciar.
- `cd "$(dirname "$0")"`: faz o script funcionar de qualquer pasta.
- `trap`: encerra de forma limpa com `Ctrl+C`.
- `"$@"`: permite filtrar um serviço, por exemplo `./logs_unificados.sh api`.

**Código (`logs_unificados.sh`):**

```bash
#!/usr/bin/env bash
# Monitora em tempo real os logs combinados dos serviços do docker-compose
# Uso: ./logs_unificados.sh            -> todos os serviços (API + Redis)
#      ./logs_unificados.sh redis      -> apenas um serviço

set -euo pipefail

cd "$(dirname "$0")"

trap 'echo; echo "Monitoramento encerrado."; exit 0' INT TERM

echo "=== Logs unificados (últimas 20 linhas + tempo real) ==="
echo "Pressione Ctrl+C para sair."
echo

docker compose logs -f --tail=20 "$@"
```

**Como executar** (execute o arquivo, não cole o conteúdo no terminal):

```bash
chmod +x logs_unificados.sh
./logs_unificados.sh
```

**Teste com evidência:** gera tráfego e salva a saída em `evidencia_logs.txt`:

```bash
timeout 15 ./logs_unificados.sh > evidencia_logs.txt 2>&1 &
sleep 3
curl http://localhost:3007/api/v1/visitas
curl -X DELETE http://localhost:3007/api/v1/visitas/reset
docker exec redis-aula23 redis-cli bgrewriteaof
wait
cat evidencia_logs.txt
```

**Resultado esperado:** linhas com os prefixos `api-aula23 |` (as requisições `GET` e `DELETE`) e `redis-aula23 |` (a reescrita do AOF) no mesmo fluxo, terminando com `Monitoramento encerrado.`.

---

## Exercício 4 - Versionar e enviar para a `main` no GitHub

**Enunciado:** versionar e enviar todas as alterações da `aula23` para a branch `main` com `git add`, `git commit` e `git push origin main`.

**Explicação:**
- `git add .`: prepara as alterações para o commit.
- `git commit -m "..."`: grava um ponto no histórico local.
- `git push origin main`: envia o commit para a branch `main` do GitHub.
- Se o push for rejeitado com `non-fast-forward`, o remoto tem commits que o local não tem. Resolva com `git pull --rebase origin main` e envie de novo.
- O `.gitignore` evita enviar `node_modules/` e `.env`.

**Comandos:**

```bash
cd ~/curso-pbe1/binario_tech/aula23
printf "node_modules/\n.env\n" > .gitignore
git add .
git commit -m "aula23: rota de reset, docker compose com volume, logs unificados e README"
git pull --rebase origin main
git push origin main
```

**Conferência:**

```bash
git status
git log --oneline -5
```

Resultado esperado: `Your branch is up to date with 'origin/main'`.

---

## Resumo

| Exercício | Entrega | Prova |
|---|---|---|
| 1 | Rota `DELETE /api/v1/visitas/reset` no `server.js` | JSON com `"chaves_removidas":1` e contador voltando a 1 |
| 2 | Volume `aula23_redis_data` | `Mountpoint`: `/var/lib/docker/volumes/aula23_redis_data/_data` |
| 3 | `logs_unificados.sh` | `evidencia_logs.txt` com logs de `api-aula23` e `redis-aula23` |
| 4 | Commit e push na `main` | `git status` mostrando `up to date with 'origin/main'` |
