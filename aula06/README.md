# Aula 06: Persistência em Arquivo JSON (API de Ocorrências)

Guia de consulta rápida para a prova (exercícios 1 a 5).
Repositório: `~/curso-pbe1/binario_tech` | Pasta: `aula06` | Arquivo da API: `ocorrencias_api.js`

Estrutura da aula:

```text
aula06/
  ocorrencias_api.js        <- API (lê e grava no arquivo)
  ocorrencias.json          <- "banco de dados" em arquivo (gerado pela API)
  limpar_dados.sh           <- reseta o ambiente (Ex. 5)
  testar_persistencia.sh    <- testa se os dados sobrevivem a reinício
```

Ideia central da aula: os dados ficam num **arquivo** e não na memória. Por isso, ao reiniciar a API, eles continuam lá.

## Preparação

Descobrir porta e rotas:

```bash
cd ~/curso-pbe1/binario_tech/aula06
grep -n "PORT\|listen" ocorrencias_api.js
grep -n "app\.\(get\|post\|put\|patch\|delete\)" ocorrencias_api.js
grep -n "ocorrencias.json\|readFileSync\|writeFileSync" ocorrencias_api.js
```

Instalar ferramentas (se faltarem):

```bash
sudo apt install -y jq httpie
http --version
jq --version
```

Subir a API:

```bash
npm install
node ocorrencias_api.js &
```

A `aula21` (processo `api-cicd` no PM2) usa a porta 3007. Se a aula06 usar a mesma porta, pare a outra antes e religue depois:

```bash
pm2 stop api-cicd          # antes
pm2 start api-cicd         # depois
```

Variável usada nos comandos (ajuste a porta se for diferente; o enunciado não cita porta):

```bash
BASE="localhost:3007/api/v1/ocorrencias"
```

Os campos do JSON (`id`, `montadora`, ...) devem seguir o que a `ocorrencias_api.js` usa. Confira no código e ajuste se os nomes forem diferentes.

## Exercício 1: GET com httpie e validação do array

```bash
http GET $BASE
```

Esperado: `HTTP/1.1 200 OK` e um **array** `[ ... ]` com os registros.

Validar que é array e comparar com o arquivo:

```bash
http --body GET $BASE | jq 'type'                    # deve mostrar "array"
http --body GET $BASE | jq 'length'                  # quantidade na API
jq 'length' ocorrencias.json                         # quantidade no arquivo (deve ser igual)
```

Se `ocorrencias.json` ainda não existe, faça um POST antes para a API criá-lo:

```bash
http POST $BASE montadora=Scania descricao="Falha no freio"
```

## Exercício 2: filtrar "Scania" com jq

```bash
jq '[.[] | select(.montadora == "Scania")]' ocorrencias.json
```

Versões úteis:

```bash
# ignorando maiúsculas/minúsculas
jq '[.[] | select(.montadora | ascii_downcase == "scania")]' ocorrencias.json

# só contar
jq '[.[] | select(.montadora == "Scania")] | length' ocorrencias.json
```

Leitura do filtro: `.[]` percorre cada item, `select(...)` mantém só os que atendem à condição, e os colchetes `[ ]` juntam o resultado de volta em array.

## Exercício 3: GET /api/v1/ocorrencias/montadora/:nome

Funções de apoio para ler e gravar o arquivo (se o código ainda não tiver):

```js
const fs = require('fs');
const path = require('path');
const ARQUIVO = path.join(__dirname, 'ocorrencias.json');

function lerDados() {
  if (!fs.existsSync(ARQUIVO)) return [];
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
}

function salvarDados(dados) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2));
}
```

A rota:

```js
app.get('/api/v1/ocorrencias/montadora/:nome', (req, res) => {
  const nome = req.params.nome.toLowerCase();
  const filtradas = lerDados().filter(o => (o.montadora || '').toLowerCase() === nome);
  res.status(200).json(filtradas);
});
```

Importante: declare essa rota **antes** de qualquer rota `/api/v1/ocorrencias/:id`. Se ficar depois, o Express entende `montadora` como se fosse um ID.

Reinicie a API e teste:

```bash
http GET $BASE/montadora/Scania
http GET $BASE/montadora/Volvo
```

Esperado: array só com a montadora pedida (ou `[]` se não houver).

## Exercício 4: DELETE /api/v1/ocorrencias/:id

```js
app.delete('/api/v1/ocorrencias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dados = lerDados();
  const indice = dados.findIndex(o => o.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Ocorrência não encontrada." });
  }

  const removida = dados.splice(indice, 1)[0];
  salvarDados(dados);
  res.status(200).json({ mensagem: "Ocorrência removida.", removida });
});
```

Reinicie a API e teste:

```bash
http GET $BASE                    # veja os IDs existentes
http DELETE $BASE/1               # remove o ID 1 (200)
jq '.[].id' ocorrencias.json      # o ID 1 não deve mais aparecer no ARQUIVO
http DELETE $BASE/99              # ID inexistente: deve dar 404
```

Prova da persistência: o registro precisa sumir do **arquivo**, e não só da resposta da API. Se o `id` na sua API for texto e não número, troque `parseInt(...)` por `req.params.id` e compare com `String(o.id)`.

## Exercício 5: limpar_dados.sh

```bash
#!/bin/bash
cd "$(dirname "$0")" || exit 1

echo "Encerrando o processo da API..."
pkill -f "node ocorrencias_api.js" && echo "Processo encerrado." || echo "Nenhum processo encontrado."

echo "Removendo ocorrencias.json..."
rm -f ocorrencias.json && echo "Arquivo removido."

echo "Ambiente resetado."
```

Rodar:

```bash
chmod +x limpar_dados.sh
./limpar_dados.sh
ls ocorrencias.json                                   # deve dar: No such file or directory
ps aux | grep "ocorrencias_api" | grep -v grep        # não deve mostrar nada
```

Cuidado: `pkill -f "node ocorrencias_api.js"` mata só a API desta aula. **Não use `pkill node`**, porque derrubaria todos os processos Node, inclusive o PM2 e a `api-cicd` da aula21.

Se você iniciou com `node ocorrencias_api.js &` e o nome do arquivo for diferente, ajuste o padrão do `pkill`.

## Teste de persistência (aula inteira)

```bash
node ocorrencias_api.js &
http POST $BASE montadora=Scania descricao="Teste"
pkill -f "node ocorrencias_api.js"           # derruba a API
node ocorrencias_api.js &                    # sobe de novo
http GET $BASE                               # o registro continua lá
```

Se o registro continua, a persistência em arquivo está funcionando.

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `Connection refused` | API fora do ar ou porta errada: `grep -n listen ocorrencias_api.js` |
| `EADDRINUSE` | `pm2 stop api-cicd` ou `pkill -f "node ocorrencias_api.js"` |
| `http: command not found` | `sudo apt install -y httpie` |
| `jq: command not found` | `sudo apt install -y jq` |
| `ocorrencias.json` não existe | faça um POST primeiro; a API cria o arquivo ao gravar |
| `/montadora/Scania` retorna 404 ou erro de ID | a rota está depois de `/:id`; mova para antes |
| DELETE retorna 200 mas o item continua no arquivo | faltou `salvarDados(dados)` |
| Mudança no código não surte efeito | reinicie a API depois de editar |
| `jq: parse error` | o arquivo JSON está corrompido ou vazio: `./limpar_dados.sh` e recomece |

## Pontos que caem na prova

1. Persistência em arquivo: ler com `fs.readFileSync`, converter com `JSON.parse`, gravar com `fs.writeFileSync` e `JSON.stringify`.
2. Rotas específicas (`/montadora/:nome`) vêm **antes** das genéricas (`/:id`).
3. `req.params` guarda o que vem na URL; `req.query` guarda o que vem depois do `?`.
4. DELETE de ID inexistente retorna 404; sucesso retorna 200 (ou 204).
5. `jq 'select(...)'` filtra; `jq length` conta; `jq type` mostra o tipo.
6. `pkill -f "node arquivo.js"` mata só a API desejada; `pkill node` mata tudo.
7. `rm -f` não dá erro se o arquivo não existir.
8. Não versione `node_modules`, `.env`, `*.log` nem o `ocorrencias.json` de teste.
