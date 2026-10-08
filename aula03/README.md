# Aula 03 – API de Telemetria (cURL, HTTPie, jq, Node.js, npm e Processos)

Passo a passo dos 8 exercícios. Basta copiar e colar os comandos no terminal.

> **Premissa:** a API roda em `http://localhost:3000`. Se a porta da sua aplicação for outra, troque o `3000` nos comandos.

---

## 0. Preparação (fazer uma vez)

Entre na pasta do projeto, instale as ferramentas e suba a aplicação.

```bash
# entrar na pasta do projeto (ajuste o nome da pasta)
cd ~/aula03

# instalar ferramentas (Debian/Ubuntu)
sudo apt update && sudo apt install -y curl jq httpie

# instalar dependências do projeto
npm install

# subir a aplicação (deixe rodando num terminal)
node telemetria.js
```

Abra **outro terminal** para rodar os exercícios.

Conferir se está tudo instalado:

```bash
curl --version | head -1
jq --version
http --version
node -v && npm -v
```
Como instalar o Node.js
Execute o comando abaixo no terminal para instalar a versão LTS recomendada usando o repositório oficial da NodeSource:

#Bash
#curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
#sudo apt-get install -y nodejs
#Como verificar se a instalação foi bem-sucedida
#Após a conclusão, rode novamente o comando para confirmar:

Bash
#node -v && npm -v
---

## Exercício 01 – GET com cURL + jq (somente `modelo`)

**Objetivo:** consultar `/api/v1/scania` e mostrar apenas a chave `modelo`.

```bash
curl -s http://localhost:3000/api/v1/scania | jq '.modelo'
```

Sem as aspas na saída:

```bash
curl -s http://localhost:3000/api/v1/scania | jq -r '.modelo'
```

**Explicação:**
- `curl -s` → faz o GET em modo silencioso (sem barra de progresso).
- `|` → envia a saída do curl para o jq.
- `jq '.modelo'` → extrai somente o valor da chave `modelo`.
- `-r` → saída *raw* (sem aspas).

---

## Exercício 02 – HTTPie e salvar em `mercedes.json`

**Objetivo:** consultar `/api/v1/mercedes` com `httpie` e salvar o resultado.

```bash
http --body GET http://localhost:3000/api/v1/mercedes > mercedes.json
```

Conferir o conteúdo salvo:

```bash
cat mercedes.json
```

**Explicação:**
- `http` → comando do HTTPie.
- `--body` (ou `-b`) → imprime só o corpo da resposta, sem cabeçalhos (assim o arquivo fica um JSON válido).
- `>` → redireciona a saída para o arquivo `mercedes.json`.

---

## Exercício 03 – Ler `mercedes.json` com jq (campo `status`)

```bash
jq '.status' mercedes.json
```

Sem aspas:

```bash
jq -r '.status' mercedes.json
```

**Explicação:** o `jq` aceita o arquivo diretamente como argumento, sem precisar do `cat`.

---

## Exercício 04 – Nova rota `/api/v1/volvo` no `telemetria.js`

**Objetivo:** adicionar a rota que retorna os dados do modelo `FH 540`, reiniciar e testar.

### 4.1 Editar o arquivo

```bash
nano telemetria.js
```

Adicione **antes** da linha `app.listen(...)`:

```js
app.get('/api/v1/volvo', (req, res) => {
  res.json({
    montadora: 'Volvo',
    modelo: 'FH 540',
    status: 'ativo'
  });
});
```

Salvar no nano: `CTRL + O`, `Enter`, depois `CTRL + X`.

> Se o seu projeto usa Express com outro nome de variável (ex.: `router`), use o mesmo nome das outras rotas.

### 4.2 Reiniciar a aplicação

No terminal onde a aplicação está rodando: `CTRL + C`, depois:

```bash
node telemetria.js
```

### 4.3 Testar a rota (em outro terminal)

```bash
curl -s http://localhost:3000/api/v1/volvo | jq
```

**Resultado esperado:**

```json
{
  "montadora": "Volvo",
  "modelo": "FH 540",
  "status": "ativo"
}
```

**Explicação:** o Node não recarrega o código sozinho. Toda alteração no `.js` exige encerrar (`CTRL + C`) e iniciar de novo.

---

## Exercício 05 – Script `start` no `package.json`

**Objetivo:** criar o script `"start": "node telemetria.js"` e testar com `npm start`.

### 5.1 Editar

```bash
nano package.json
```

Dentro do bloco `scripts`, deixe assim:

```json
"scripts": {
  "start": "node telemetria.js"
}
```

> Atenção às vírgulas: se houver outros scripts, separe-os por vírgula, e o último não leva vírgula.

### Alternativa (sem editar manualmente)

```bash
npm pkg set scripts.start="node telemetria.js"
```

### 5.2 Conferir e testar

```bash
cat package.json
npm start
```

**Explicação:** `npm start` executa o comando definido em `scripts.start`. Antes de rodar, encerre a instância anterior (`CTRL + C`) para a porta não ficar ocupada.

---

## Exercício 06 – Direcionar a auditoria para `relatorio.log`

**Objetivo:** salvar a saída do `testar_telemetria.sh` no arquivo `relatorio.log`.

```bash
chmod +x testar_telemetria.sh
./testar_telemetria.sh > relatorio.log 2>&1
```

Conferir:

```bash
cat relatorio.log
```

### Variações úteis

```bash
# acrescentar ao final do log, sem apagar o conteúdo anterior
./testar_telemetria.sh >> relatorio.log 2>&1

# mostrar na tela E gravar no arquivo
./testar_telemetria.sh 2>&1 | tee relatorio.log
```

**Explicação:**
- `>` → grava (sobrescreve) a saída padrão (stdout) no arquivo.
- `>>` → acrescenta ao final do arquivo.
- `2>&1` → envia também os erros (stderr) para o mesmo destino.
- `chmod +x` → dá permissão de execução ao script.

---

## Exercício 07 – `montadora` e `status` em uma única chamada `jq`

```bash
curl -s http://localhost:3000/api/v1/vw | jq '{montadora, status}'
```

Resultado em formato de texto simples (uma linha):

```bash
curl -s http://localhost:3000/api/v1/vw | jq -r '"\(.montadora) - \(.status)"'
```

**Explicação:** `jq '{montadora, status}'` monta um novo objeto JSON contendo somente os dois campos, em **uma única** chamada do jq.

---

## Exercício 08 – Encontrar o PID do Node e encerrar com `kill -9`

### 8.1 Localizar o processo

```bash
ps aux | grep node
```

Exemplo de saída:

```
usuario   12345  0.5  1.2 ... node telemetria.js
usuario   12399  0.0  0.0 ... grep --color=auto node
```

O **PID é o número da 2ª coluna** da linha `node telemetria.js` (aqui, `12345`). Ignore a linha do próprio `grep`.

### 8.2 Encerrar

```bash
kill -9 12345
```

Troque `12345` pelo PID que apareceu no seu terminal.

### 8.3 Confirmar que encerrou

```bash
ps aux | grep node
```

Só deve restar a linha do `grep`.

### Atalho (pega o PID automaticamente)

```bash
kill -9 $(pgrep -f "node telemetria.js")
```

**Explicação:**
- `ps aux` → lista todos os processos.
- `grep node` → filtra as linhas que contêm "node".
- `kill -9` → envia o sinal SIGKILL, que força o encerramento imediato.
- Preferir `kill <PID>` (sinal 15) quando possível; use `-9` se o processo não responder.

---

## Resumo rápido (cola para a prova)

| Ex. | Comando |
|-----|---------|
| 01 | `curl -s localhost:3000/api/v1/scania \| jq '.modelo'` |
| 02 | `http -b localhost:3000/api/v1/mercedes > mercedes.json` |
| 03 | `jq '.status' mercedes.json` |
| 04 | `nano telemetria.js` → adicionar rota → `node telemetria.js` → `curl -s localhost:3000/api/v1/volvo \| jq` |
| 05 | `"start": "node telemetria.js"` → `npm start` |
| 06 | `./testar_telemetria.sh > relatorio.log 2>&1` |
| 07 | `curl -s localhost:3000/api/v1/vw \| jq '{montadora, status}'` |
| 08 | `ps aux \| grep node` → `kill -9 <PID>` |

---

## Subir este README para o GitHub

```bash
git add README.md
git commit -m "Adiciona README da Aula 03"
git push origin main
```

> Se a sua branch principal for `master`, troque `main` por `master`.
