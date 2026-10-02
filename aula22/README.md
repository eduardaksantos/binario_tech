# Aula 22: Docker (Imagens, Containers e Limpeza)

Guia de consulta rápida para a prova (exercícios 1 a 4).
Repositório: `~/curso-pbe1/binario_tech` | Pasta: `aula22`

Estrutura da aula:

```text
aula22/
  Dockerfile        <- receita da imagem
  .dockerignore     <- o que NÃO entra na imagem (node_modules, .env...)
  package.json
  server.js         <- API que roda dentro do container
  limpar_ambiente_docker.sh   <- limpeza (Ex. 3)
```

Conceitos:

| Termo | O que é |
|---|---|
| Imagem | molde pronto da aplicação (somente leitura) |
| Container | instância em execução de uma imagem |
| Tag | nome:versão de uma imagem (`api-docker:1.0`, `api-docker:latest`) |
| Dangling image | imagem sem tag (`<none>`), sobra de builds antigos |
| `-p host:container` | liga a porta do seu ambiente à porta dentro do container |

## Preparação

Conferir o Docker e descobrir o nome da imagem que você já construiu na aula:

```bash
cd ~/curso-pbe1/binario_tech/aula22
docker --version
docker images
docker ps -a
ls Dockerfile .dockerignore
grep -n "PORT\|listen\|NODE_ENV" server.js
```

- O `docker images` mostra o nome e a tag da imagem da aula (coluna `REPOSITORY` e `TAG`). Anote.
- O `grep` mostra em qual porta o `server.js` escuta dentro do container (o exercício 2 usa a 4000).
- Se não existir imagem, construa uma (o nome `api-docker:1.0` abaixo é um exemplo, use o da sua aula):

```bash
docker build -t api-docker:1.0 .
```

Exemplo de `Dockerfile`, caso o arquivo não exista:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

Nos comandos abaixo, troque `api-docker:1.0` pelo nome real que apareceu no `docker images`.

## Exercício 1: criar a tag `binario-tech/api-docker:latest`

Sintaxe: `docker tag IMAGEM_ORIGEM NOVO_NOME:TAG`

```bash
docker tag api-docker:1.0 binario-tech/api-docker:latest
docker images | grep api-docker
```

Esperado: duas linhas com o **mesmo IMAGE ID**: a original e `binario-tech/api-docker` com a tag `latest`.

`docker tag` não copia nada: só cria um novo nome apontando para a mesma imagem.

## Exercício 2: segundo container em background (homologação)

```bash
docker run -d \
  --name container-telemetria-hml \
  -p 8083:4000 \
  -e NODE_ENV=homologacao \
  binario-tech/api-docker:latest
```

Significado das opções:

| Opção | Função |
|---|---|
| `-d` | roda em segundo plano (detached) |
| `--name` | dá nome ao container |
| `-p 8083:4000` | porta **8083** do host leva à porta **4000** do container |
| `-e NODE_ENV=homologacao` | define a variável de ambiente dentro do container |

Provar que funcionou:

```bash
docker ps                                                  # container-telemetria-hml com 0.0.0.0:8083->4000/tcp
curl -s http://localhost:8083/                             # a API responde (ajuste a rota se precisar)
docker exec container-telemetria-hml env | grep NODE_ENV   # deve mostrar NODE_ENV=homologacao
docker logs container-telemetria-hml                       # saída da aplicação
```

Se der `port is already allocated`, a 8083 está ocupada: `docker ps` para ver quem usa. Se der `name is already in use`, o container já existe: `docker rm -f container-telemetria-hml` e rode de novo.

Se a API responde só dentro do container, confirme que o `server.js` escuta na porta 4000 (`process.env.PORT || 4000`) e em todas as interfaces, e não só em `127.0.0.1`.

## Exercício 3: limpar_ambiente_docker.sh

Remove containers inativos e imagens pendentes (dangling), usando filtros. **Não mexe em containers que estão rodando.**

```bash
#!/bin/bash
echo "=== Containers inativos (exited/created) ==="
INATIVOS=$(docker ps -aq --filter "status=exited" --filter "status=created")
if [ -n "$INATIVOS" ]; then
  docker rm $INATIVOS
else
  echo "Nenhum container inativo."
fi

echo "=== Imagens pendentes (dangling) ==="
PENDENTES=$(docker images -q --filter "dangling=true")
if [ -n "$PENDENTES" ]; then
  docker rmi $PENDENTES
else
  echo "Nenhuma imagem pendente."
fi

echo "=== Estado final ==="
docker ps -a
docker images
```

Rodar:

```bash
chmod +x limpar_ambiente_docker.sh
./limpar_ambiente_docker.sh
```

Atalhos equivalentes que o Docker já traz:

```bash
docker container prune -f      # remove todos os containers parados
docker image prune -f          # remove imagens dangling
```

O `-q` mostra só os IDs e o `--filter` escolhe quais itens listar. Cuidado: `docker system prune -a` apaga **todas** as imagens sem uso, inclusive as que você quer manter.

Se quiser parar também um container em execução antes de remover: `docker stop container-telemetria-hml`.

## Exercício 4: versionar e enviar a aula22

Garantir que arquivos pesados ou secretos não sobem:

```bash
cd ~/curso-pbe1/binario_tech
cat .gitignore                 # deve conter node_modules/, .env e *.log
cat aula22/.dockerignore       # deve conter node_modules e .env
```

Enviar:

```bash
cd ~/curso-pbe1/binario_tech
git status
git add aula22
git commit -m "feat: docker, tags, containers e limpeza - aula22"
git push origin main
```

Conferir:

```bash
git status                     # up to date with 'origin/main'
git ls-files aula22            # arquivos versionados
git log --oneline -3
```

Se o `push` for rejeitado (`non-fast-forward`): `git pull --no-rebase origin main` e `git push origin main` de novo.

## Provas rápidas (saída verde)

```bash
echo -e "\033[1;32m$(docker images | grep api-docker)\033[0m"
echo -e "\033[1;32m$(docker ps --filter name=container-telemetria-hml)\033[0m"
echo -e "\033[1;32m$(docker exec container-telemetria-hml env | grep NODE_ENV)\033[0m"
echo -e "\033[1;32m$(git -C ~/curso-pbe1/binario_tech log --oneline -3)\033[0m"
```

## Comandos Docker mais cobrados

| Comando | Função |
|---|---|
| `docker build -t nome:tag .` | constrói a imagem a partir do Dockerfile |
| `docker images` | lista imagens |
| `docker tag ORIGEM DESTINO` | cria outro nome para a imagem |
| `docker run -d --name X -p H:C -e VAR=valor imagem` | cria e inicia um container |
| `docker ps` / `docker ps -a` | lista containers rodando / todos |
| `docker logs X` | mostra a saída do container |
| `docker exec X comando` | executa comando dentro do container |
| `docker stop X` / `docker start X` | para / inicia |
| `docker rm X` / `docker rm -f X` | remove / remove à força |
| `docker rmi imagem` | remove imagem |
| `docker container prune` / `docker image prune` | limpeza em massa |

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `Cannot connect to the Docker daemon` | Docker não está rodando; no Cloud Shell, confira `docker ps` e, se precisar, `sudo docker ps` |
| `permission denied` no Docker | use `sudo docker ...` ou adicione o usuário ao grupo docker |
| `No such image` | nome ou tag errados: confira `docker images` |
| `port is already allocated` | porta ocupada: `docker ps` e pare quem usa, ou troque a porta do host |
| `name is already in use` | `docker rm -f NOME` e rode de novo |
| Container sobe e cai logo | `docker logs NOME` mostra o erro |
| `curl` na 8083 não responde | porta interna errada no `-p` ou app escutando só em 127.0.0.1 |
| Imagem enorme | falta `.dockerignore` com `node_modules` |
| Script de limpeza dá erro de `rm` vazio | use a versão com `if [ -n "$VAR" ]` acima |

## Pontos que caem na prova

1. `-p HOST:CONTAINER`: a porta de fora vem primeiro, a de dentro vem depois.
2. `-d` roda em segundo plano; sem ele o terminal fica preso ao container.
3. `-e VAR=valor` define variável de ambiente no container.
4. `docker tag` só cria um apelido; o IMAGE ID continua o mesmo.
5. Dangling image = imagem sem nome/tag (`<none>`), filtrada com `dangling=true`.
6. `docker ps` mostra só os que rodam; `docker ps -a` mostra todos.
7. `.dockerignore` mantém `node_modules` e `.env` fora da imagem.
8. Nunca versione `.env` nem `node_modules`; o `Dockerfile` e o código sim.
