# Aula 21: CI/CD Local e Automação de Deploy

Guia de consulta rápida para a prova (exercícios 1 a 4).
Repositório: `~/curso-pbe1/binario_tech` | Pasta: `aula21` | Porta da API: `3007`

Regra prática: arquivos e deploy na pasta `aula21`, comandos Git sempre na raiz `binario_tech`.

| Ex. | O que pede | Prova |
|---|---|---|
| 1 | Mudar versão para `1.0.1`, commitar e rodar o deploy | `curl` retorna `1.0.1` |
| 2 | Gerar `deploy_history.log` (data, hora, hash) a cada deploy | `cat deploy_history.log` |
| 3 | Hook `post-commit` que chama o `deploy.sh` na `main` | commit dispara o deploy sozinho |
| 4 | Versionar `server.js`, `deploy.sh`, `package.json` e enviar ao GitHub | arquivos visíveis no GitHub |

## Pré-requisitos

```bash
cd ~/curso-pbe1/binario_tech
git branch --show-current     # deve mostrar: main
pm2 list                      # api-cicd deve estar online
ls -l aula21/deploy.sh        # deve ter x (executável)
```

Branch `master`? Renomeie: `git branch -m main`

## Exercício 1: versão 1.0.1

```bash
cd ~/curso-pbe1/binario_tech/aula21
sed -i 's/versao: "1.0.0"/versao: "1.0.1"/' server.js
grep -n 'versao:' server.js            # deve mostrar versao: "1.0.1"
git add server.js
git commit -m "chore: bump versao para 1.0.1"
./deploy.sh
curl -s http://localhost:3007/api/v1/versao
```

Esperado: `"versao":"1.0.1"`. Quem aplica a mudança é o `pm2 restart` dentro do `deploy.sh`.

## Exercício 2: deploy_history.log

No `deploy.sh`, guardar o hash logo após o `git pull`:

```bash
COMMIT_HASH=$(git rev-parse --short HEAD)
```

E gravar dentro do `if` de sucesso:

```bash
echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy com sucesso - Commit: $COMMIT_HASH" >> "$APP_DIR/deploy_history.log"
```

Testar:

```bash
./deploy.sh
cat deploy_history.log
git rev-parse --short HEAD     # deve bater com o hash da última linha
```

Use `>>` (acrescenta). Um único `>` apagaria o histórico.

## Exercício 3: hook post-commit

```text
git commit --> post-commit --> branch é main? --> sim: deploy.sh / não: ignora
```

Criar na raiz do repositório:

```bash
cd ~/curso-pbe1/binario_tech

cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
  echo "Commit na main detectado. Disparando deploy..."
  ROOT=$(git rev-parse --show-toplevel)
  nohup bash "$ROOT/aula21/deploy.sh" > "$ROOT/aula21/deploy_hook.log" 2>&1 &
else
  echo "Branch '$BRANCH': deploy ignorado."
fi
EOF

chmod +x .git/hooks/post-commit
ls -l .git/hooks/post-commit     # deve ter -rwxr-xr-x
```

Linhas principais:

- `git rev-parse --abbrev-ref HEAD`: nome da branch atual.
- `git rev-parse --show-toplevel`: raiz do repositório.
- `nohup ... &`: roda o deploy em segundo plano, o commit não trava.
- `> deploy_hook.log 2>&1`: grava saída e erros no log.

Testar na `main` (deve fazer deploy):

```bash
git commit --allow-empty -m "teste do hook"
sleep 12
cat aula21/deploy_hook.log      # deve terminar em [SUCESSO]
```

Testar em outra branch (não deve fazer deploy):

```bash
git checkout -b teste
git commit --allow-empty -m "teste outra branch"
git checkout main
git branch -D teste
```

## Exercício 4: enviar ao GitHub

```bash
cd ~/curso-pbe1/binario_tech
printf "node_modules/\n.env\n*.log\n" > .gitignore
git remote -v        # se vazio: git remote add origin URL_DO_REPO
git status
git add aula21/server.js aula21/deploy.sh aula21/package.json
git commit -m "feat: pipeline de deploy automatizado - aula21"
git push -u origin main
git ls-files aula21
```

O GitHub não aceita senha no push: use Personal Access Token.

## Provas rápidas (saída verde)

```bash
echo -e "\033[1;32m$(curl -s http://localhost:3007/api/v1/versao)\033[0m"
echo -e "\033[1;32m$(cat ~/curso-pbe1/binario_tech/aula21/deploy_history.log)\033[0m"
echo -e "\033[1;32m$(ls -l ~/curso-pbe1/binario_tech/.git/hooks/post-commit)\033[0m"
echo -e "\033[1;32m$(git -C ~/curso-pbe1/binario_tech log --oneline -3)\033[0m"
```

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `curl` mostra versão antiga | `./deploy.sh` ou `pm2 restart api-cicd` |
| `sed` não troca nada | `grep -n versao server.js` e ajuste o padrão |
| `nothing to commit` | `git commit --allow-empty -m "..."` |
| Hook não faz nada | `chmod +x .git/hooks/post-commit` |
| "deploy ignorado" na main | branch é `master`: `git branch -m main` |
| `Permission denied` no deploy | `chmod +x aula21/deploy.sh` |
| `pm2: command not found` | reinstalar o PM2 (abaixo) |
| `push` rejeitado | `git pull --no-rebase origin main` e `git push` |
| `no upstream branch` | `git push -u origin main` |
| `EADDRINUSE` | `pm2 list` e `pm2 delete` do processo antigo |

Reinstalar o PM2 no Cloud Shell:

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g pm2
cd ~/curso-pbe1/binario_tech/aula21
pm2 start server.js --name api-cicd
```

## Pontos que caem na prova

1. O hook não vai para o GitHub: `.git/hooks` não é versionado. Em clone novo, recrie.
2. O `post-commit` só dispara em `git commit` feito no próprio repositório. Um `git pull` não dispara.
3. Sem `chmod +x`, o Git ignora o hook.
4. O `&` no final do hook evita que o commit fique travado.
5. Nunca faça `git commit` dentro do `deploy.sh`: cria loop infinito.
6. O arquivo se chama `post-commit` (com hífen, sem `.sh`).
7. Não versione `node_modules`, `.env` nem `*.log`.
8. Evite `git push --force`.

## Fluxo resumido

```text
EX. 1  editar server.js -> git commit -> ./deploy.sh -> curl mostra 1.0.1
EX. 2  deploy.sh -> grava deploy_history.log (data, hora, hash)
EX. 3  git commit -> post-commit -> se main: deploy.sh
EX. 4  git add -> git commit -> git push origin main -> GitHub
```
