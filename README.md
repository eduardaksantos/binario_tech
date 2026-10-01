ULA 21 — GUIA DE CONSULTA

## Estrutura

```text
binario_tech/
└── aula21/
    ├── server.js
    ├── deploy.sh
    ├── package.json
    └── deploy_history.log
```

---

# EXERCÍCIO 1 — Alterar a versão e fazer o Deploy

**Objetivo:** alterar a versão da API para `1.0.1`, fazer o commit e confirmar a alteração no endpoint.

### 1. Entrar na pasta da aplicação

```bash
cd ~/curso-pbe1/binario_tech/aula21
```

### 2. Abrir o `server.js`

```bash
nano server.js
```

Procure:

```javascript
versao: "1.0.0",
```

Altere para:

```javascript
versao: "1.0.1",
```

Salvar:

```text
CTRL + O → ENTER → CTRL + X
```

### 3. Fazer o commit

Voltar para o repositório:

```bash
cd ~/curso-pbe1/binario_tech
```

Adicionar:

```bash
git add aula21/server.js
```

Criar o commit:

```bash
git commit -m "Atualiza versão para 1.0.1"
```

### 4. Executar o deploy

```bash
cd aula21
```

Se necessário, dar permissão:

```bash
chmod +x deploy.sh
```

Executar:

```bash
./deploy.sh
```

O script deve atualizar o código, instalar dependências, reiniciar o PM2 e fazer o Smoke Test.

### 5. Conferir a versão

```bash
curl http://localhost:3002/api/v1/versao
```

Procure na resposta:

```text
"versao": "1.0.1"
```

**Resultado esperado:** HTTP `200` e versão `1.0.1`.

---

# EXERCÍCIO 2 — Criar histórico de Deploy

**Objetivo:** registrar cada deploy realizado com **data, hora e hash do commit**.

### 1. Abrir o `deploy.sh`

```bash
cd ~/curso-pbe1/binario_tech/aula21
nano deploy.sh
```

### 2. Adicionar o registro do deploy

Dentro do `if` de sucesso do Smoke Test:

```bash
if [ "$HTTP_STATUS" -eq 200 ]; then
```

adicione:

```bash
echo "$(date '+%Y-%m-%d %H:%M:%S') - Commit: $(git rev-parse --short HEAD)" >> deploy_history.log
```

O trecho fica:

```bash
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "\n[SUCESSO] Deploy realizado e verificado com sucesso! HTTP Status 200."

    echo "$(date '+%Y-%m-%d %H:%M:%S') - Commit: $(git rev-parse --short HEAD)" >> deploy_history.log

    pm2 list | grep $APP_NAME
```

Salvar:

```text
CTRL + O → ENTER → CTRL + X
```

### 3. Executar o deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Conferir o arquivo

```bash
cat deploy_history.log
```

Exemplo:

```text
2026-10-01 15:20:10 - Commit: a3f91bc
```

**O que cada parte faz:**

```text
date                         → data e hora
git rev-parse --short HEAD   → hash curto do último commit
>> deploy_history.log        → salva no arquivo
```

Cada novo deploy adicionará uma nova linha.

---

# EXERCÍCIO 3 — Git Hook `post-commit`

**Objetivo:** fazer o `deploy.sh` ser executado automaticamente depois de um commit na branch `main`.

### 1. Entrar no repositório

```bash
cd ~/curso-pbe1/binario_tech
```

### 2. Criar o Hook

```bash
nano .git/hooks/post-commit
```

Cole:

```bash
#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "main" ]; then
    echo "Commit na main detectado. Executando deploy.sh..."

    cd ~/curso-pbe1/binario_tech/aula21
    ./deploy.sh
else
    echo "Commit na branch '$BRANCH': deploy ignorado."
fi
```

Salvar:

```text
CTRL + O → ENTER → CTRL + X
```

### 3. Dar permissão

```bash
chmod +x .git/hooks/post-commit
```

**Importante:** sem essa permissão, o Git não executa o Hook.

### 4. Testar na `main`

Confira a branch:

```bash
git branch --show-current
```

Se aparecer:

```text
main
```

Faça um commit de teste:

```bash
git commit --allow-empty -m "teste do hook"
```

O Hook será executado automaticamente:

```text
Commit na main detectado. Executando deploy.sh...
```

Depois o `deploy.sh` executará o deploy e o Smoke Test.

### 5. Testar outra branch

Criar:

```bash
git checkout -b teste-hook
```

Fazer commit:

```bash
git commit --allow-empty -m "commit fora da main"
```

Resultado:

```text
Commit na branch 'teste-hook': deploy ignorado.
```

### Observação

A pasta:

```text
.git/hooks/
```

não é enviada para o GitHub.

Por isso, para deixar o Hook visível no projeto, pode copiar:

```bash
mkdir -p aula21/hooks
cp .git/hooks/post-commit aula21/hooks/post-commit
```

---

# EXERCÍCIO 4 — Enviar para o GitHub

**Objetivo:** versionar os arquivos da `aula21` e enviar para o repositório remoto.

### 1. Voltar para o repositório

```bash
cd ~/curso-pbe1/binario_tech
```

### 2. Conferir alterações

```bash
git status
```

Mostra quais arquivos foram alterados.

### 3. Adicionar a aula

```bash
git add aula21/
```

Isso adiciona:

```text
server.js
deploy.sh
package.json
deploy_history.log
```

e outros arquivos dentro de `aula21`.

### 4. Criar o commit

```bash
git commit -m "Finaliza Aula 21"
```

### 5. Enviar para o GitHub

```bash
git push origin main
```

**`origin`** = repositório remoto.

**`main`** = branch que será atualizada.

### 6. Conferir

```bash
git status
```

---

# COMANDOS MAIS IMPORTANTES

| Comando                             | Função                    |
| ----------------------------------- | ------------------------- |
| `git status`                        | Ver alterações            |
| `git add .`                         | Adicionar alterações      |
| `git commit -m "..."`               | Criar commit              |
| `git push origin main`              | Enviar para GitHub        |
| `git pull origin main`              | Baixar alterações         |
| `./deploy.sh`                       | Executar deploy           |
| `pm2 list`                          | Ver aplicações            |
| `pm2 restart api-cicd`              | Reiniciar API             |
| `pm2 logs api-cicd`                 | Ver logs                  |
| `curl localhost:3002/api/v1/versao` | Testar API                |
| `cat deploy_history.log`            | Ver histórico             |
| `git rev-parse --short HEAD`        | Ver hash do commit        |
| `chmod +x arquivo`                  | Dar permissão de execução |

# FLUXO DOS EXERCÍCIOS

```text
EX. 1
Alterar server.js
      ↓
git commit
      ↓
./deploy.sh
      ↓
curl → versão 1.0.1

EX. 2
deploy.sh
      ↓
deploy_history.log
      ↓
data + hora + hash

EX. 3
git commit
      ↓
post-commit
      ↓
verifica branch
      ↓
main → deploy.sh
outra → ignora

EX. 4
git add
      ↓
git commit
      ↓
git push origin main
      ↓
GitHub
```

