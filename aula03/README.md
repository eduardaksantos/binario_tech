# Aula 03 – API de Telemetria (cURL, HTTPie, jq, Node.js, npm e Processos)

Passo a passo dos 8 exercícios, já testado no Cloud Shell.

## Informações importantes

- Pasta do projeto: `~/curso-pbe1/binario_tech/aula03`
- A API roda em **http://localhost:3007** (porta definida em `telemetria.js`).
- Rotas existentes: `/api/v1/scania`, `/api/v1/mercedes`, `/api/v1/vw`, `/api/v1/volvo`.
- O servidor ocupa o terminal enquanto roda. Por isso use **duas abas**:
  - **Aba 1:** sobe o servidor e fica quieta (não digite nada nela).
  - **Aba 2:** aberta no botão **+** do terminal, usada para rodar os exercícios.
- Erro `Connection refused` = servidor não está rodando ou a porta está errada.

---

## 0. Preparação (fazer uma vez)

Entrar na pasta do projeto, instalar as ferramentas e as dependências.

```bash
# entrar na pasta do projeto
cd ~/curso-pbe1/binario_tech/aula03

# instalar ferramentas (Debian/Ubuntu)
sudo apt update && sudo apt install -y curl jq httpie

# instalar dependências do projeto (lê o package.json)
npm install

# subir aplicação
# node telemetria.js
```

Depois, subir a aplicação (seção 0.1) e **abrir outra aba** para rodar os exercícios.

### Conferir se está tudo instalado

```bash
curl --version | head -1
jq --version
http --version
node -v && npm -v
```

### Como instalar o Node.js (só se o `node -v` não funcionar)

Instala a versão LTS pelo repositório oficial da NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verificar se a instalação deu certo:

```bash
node -v && npm -v
```

> No Cloud Shell, as ferramentas e o Node.js normalmente já vêm instalados. Rode a conferência acima e só instale o que faltar.

## 0.1 Subir o servidor (a cada sessão)

**Aba 1** – subir o servidor e deixar quieta:

```bash
cd ~/curso-pbe1/binario_tech/aula03
npm start
```

Deve aparecer: `[Binario Tech] Servidor de Telemetria rodando em http://localhost:3007`

**Aba 2** – entrar na pasta e rodar os exercícios:

```bash
cd ~/curso-pbe1/binario_tech/aula03
```

---

## Exercício 01 – GET com cURL + jq (somente `modelo`)

```bash
curl -s http://localhost:3007/api/v1/scania | jq '.modelo'
```

Saída: `"R450"`. Sem aspas:

```bash
curl -s http://localhost:3007/api/v1/scania | jq -r '.modelo'
```

- `curl -s` → GET em modo silencioso (sem barra de progresso). Se o servidor estiver fora do ar, não mostra erro.
- `|` → envia a saída do curl para o jq.
- `jq '.modelo'` → extrai só o valor da chave `modelo`.
- `-r` → saída raw (sem aspas).

## Exercício 02 – HTTPie e salvar em `mercedes.json`

```bash
http --body GET http://localhost:3007/api/v1/mercedes > mercedes.json
cat mercedes.json
```

- `http` → comando do HTTPie.
- `--body` (ou `-b`) → imprime só o corpo, sem cabeçalhos. Sem isso o arquivo não fica um JSON válido.
- `>` → redireciona a saída para o arquivo.

## Exercício 03 – Ler `mercedes.json` com jq (campo `status`)

```bash
jq '.status' mercedes.json
```

Sem aspas:

```bash
jq -r '.status' mercedes.json
```

Saída: `OK`. O jq aceita o arquivo direto como argumento, sem precisar do `cat`.

## Exercício 04 – Rota `/api/v1/volvo` (modelo FH 540)

**4.1 Ver se a rota existe:**

```bash
grep -n "volvo" telemetria.js
```

**4.2 Se não existir, editar:**

```bash
nano telemetria.js
```

Adicione **antes** de `app.listen(...)`, no mesmo padrão das outras rotas:

```javascript
// Rota Volvo
app.get('/api/v1/volvo', (req, res) => {
    res.json({ montadora: "Volvo", modelo: "FH 540", status: "OK", conexao: true, velocidade_media: 85 });
});
```

Salvar no nano: `CTRL+O`, `Enter`, `CTRL+X`.

**4.3 Reiniciar a aplicação** (na aba 1): `CTRL+C` e depois:

```bash
npm start
```

O Node **não recarrega** o código sozinho: toda alteração no `.js` exige reiniciar.

**4.4 Testar (aba 2):**

```bash
curl -s http://localhost:3007/api/v1/volvo | jq
```

Resultado esperado:

```json
{
  "montadora": "Volvo",
  "modelo": "FH 540",
  "status": "OK",
  "conexao": true,
  "velocidade_media": 85
}
```

Se der `Cannot GET /api/v1/volvo`, esqueceu de reiniciar ou a rota ficou depois do `app.listen`.

## Exercício 05 – Script `start` no `package.json`

```bash
nano package.json
```

Dentro do bloco `scripts`:

```json
"scripts": {
  "start": "node telemetria.js"
}
```

Atenção às vírgulas: se houver outros scripts, separe por vírgula; o último não leva.

Alternativa sem editar manualmente:

```bash
npm pkg set scripts.start="node telemetria.js"
```

**Conferir e testar:**

```bash
cat package.json
npm start
```

`npm start` executa o comando definido em `scripts.start`. Se der `EADDRINUSE`, a porta está ocupada por outra instância: pare-a com `CTRL+C` na outra aba.

## Exercício 06 – Direcionar a auditoria para `relatorio.log`

**Antes:** o script precisa apontar para a porta certa. Corrigir (3001 → 3007) e dar permissão:

```bash
sed -i 's/3001/3007/g' testar_telemetria.sh
chmod +x testar_telemetria.sh
```

**Comando do exercício (servidor rodando na aba 1):**

```bash
./testar_telemetria.sh > relatorio.log 2>&1
cat relatorio.log
```

Variações:

```bash
# acrescentar ao final do log, sem apagar o anterior
./testar_telemetria.sh >> relatorio.log 2>&1

# mostrar na tela E gravar no arquivo
./testar_telemetria.sh 2>&1 | tee relatorio.log
```

- `>` → grava (sobrescreve) a saída padrão (stdout).
- `>>` → acrescenta ao final do arquivo.
- `2>&1` → envia também os erros (stderr) para o mesmo destino.
- `chmod +x` → dá permissão de execução ao script.
- A frase "Auditoria finalizada com sucesso!" é fixa no script: sempre confira se o JSON de cada rota apareceu no log.
- O `"status": "ALERTA"` da Volkswagen é proposital (veículo sem conexão).

## Exercício 07 – `montadora` e `status` em uma única chamada jq

```bash
curl -s http://localhost:3007/api/v1/vw | jq '{montadora, status}'
```

Saída:

```json
{
  "montadora": "Volkswagen",
  "status": "ALERTA"
}
```

Em texto simples, uma linha:

```bash
curl -s http://localhost:3007/api/v1/vw | jq -r '"\(.montadora) - \(.status)"'
```

`{montadora, status}` monta um novo objeto só com os dois campos (forma curta de `{montadora: .montadora, status: .status}`).

## Exercício 08 – Encontrar o PID do Node e encerrar com `kill -9`

**8.1 Localizar o processo** (com o servidor rodando):

```bash
ps aux | grep node
```

No Cloud Shell aparecem várias linhas `node` do próprio editor (`code-oss-for-cloud-shell`). **Não mate essas.** A que interessa é a que termina em `node telemetria.js`:

```
eduarda+  6218  1.5  0.8 ... pts/2  S<l+ 04:24  0:00 node telemetria.js
```

O PID é o número da **2ª coluna** (aqui, `6218`). Ignore a linha do próprio `grep`.

**8.2 Encerrar** (use o PID que aparece na SUA tela; o PID muda a cada execução):

```bash
kill -9 6218
```

**8.3 Confirmar:**

```bash
ps aux | grep telemetria
```

Só deve restar a linha do `grep`. Na aba 1 aparece `Killed`.

**Atalho** (pega o PID automaticamente):

```bash
kill -9 $(pgrep -f "node telemetria.js")
```

- `ps aux` → lista todos os processos.
- `grep node` → filtra as linhas com "node".
- `kill -9` → envia SIGKILL (encerramento imediato). O `kill <PID>` (sinal 15) é o jeito mais gentil; use `-9` se o processo não responder.

---

## Resumo rápido (cola para a prova)

| Ex. | Comando |
|-----|---------|
| 01 | `curl -s localhost:3007/api/v1/scania \| jq '.modelo'` |
| 02 | `http -b localhost:3007/api/v1/mercedes > mercedes.json` |
| 03 | `jq '.status' mercedes.json` |
| 04 | `nano telemetria.js` → adicionar rota → `CTRL+C` → `npm start` → `curl -s localhost:3007/api/v1/volvo \| jq` |
| 05 | `"start": "node telemetria.js"` → `npm start` |
| 06 | `./testar_telemetria.sh > relatorio.log 2>&1` |
| 07 | `curl -s localhost:3007/api/v1/vw \| jq '{montadora, status}'` |
| 08 | `ps aux \| grep node` → `kill -9 <PID>` |

## Erros comuns

- `Connection refused` → servidor desligado ou porta errada (a correta é 3007).
- `EADDRINUSE` → já existe um servidor rodando na porta; pare-o com `CTRL+C`.
- Log com seções vazias → porta errada no script ou servidor desligado.
- `kill: No such process` → PID digitado não existe; consulte o `ps aux` de novo.
