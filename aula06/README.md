# Aula 06: Persistência em Disco, `fs/promises` e CRUD de Ocorrências da Frota

API REST em Node.js/Express que guarda as ocorrências da frota no arquivo `ocorrencias.json`, usando o módulo nativo `fs/promises` (em vez de guardar tudo na memória, os dados sobrevivem ao reinício do servidor).

- Porta: **3007**
- Arquivo de dados: `ocorrencias.json`
- Arquivo principal: `ocorrencias_api.js`

## Como usar (leia antes)

Use **dois terminais** na pasta `aula06`:

- **Terminal 1:** roda a API e fica ocupado. Não digite mais nada nele.
- **Terminal 2:** roda os testes (`http`, `jq`, `cat`).

Se aparecer `200~` antes dos comandos colados, rode `printf '\e[?2004l'`.

## Preparação

Terminal 1:

```bash
cd ~/curso-pbe1/binario_tech/aula06
npm install
node ocorrencias_api.js
```

Espere a mensagem `API de Ocorrencias ativa na porta 3007`.

Terminal 2:

```bash
cd ~/curso-pbe1/binario_tech/aula06
```

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/v1/ocorrencias` | lista todas |
| POST | `/api/v1/ocorrencias` | cadastra (montadora, placa, descricao) |
| GET | `/api/v1/ocorrencias/montadora/:nome` | filtra por montadora |
| DELETE | `/api/v1/ocorrencias/:id` | remove por ID |

## Persistência com `fs/promises`

Funções que leem e gravam o arquivo `ocorrencias.json` (código do `ocorrencias_api.js`):

```js
const ARQUIVO_DADOS = path.join(__dirname, 'ocorrencias.json');

app.use(cors());
app.use(express.json());

// Função Auxiliar: Ler Arquivo JSON
async function lerOcorrencias() {
    try {
        const dados = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        await fs.writeFile(ARQUIVO_DADOS, '[]', 'utf-8');
        return [];
    }
}

// Função Auxiliar: Salvar no Arquivo JSON
async function salvarOcorrencia(ocorrencias) {
    await fs.writeFile(ARQUIVO_DADOS, JSON.stringify(ocorrencias, null, 2), 'utf-8');
}
```

- `fs.readFile` lê o conteúdo do arquivo (texto) e `JSON.parse` transforma em array.
- `fs.writeFile` grava o array de volta no arquivo com `JSON.stringify`.
- Como cada rota lê o arquivo a cada requisição, os dados editados sempre aparecem na resposta.

---

## Exercício 1: GET com HTTPie e validação do array

**Objetivo:** fazer um GET em `/api/v1/ocorrencias` e validar que a resposta é um array com os registros do `ocorrencias.json`.

**Passo 1.** Cadastre dados de teste (se o arquivo estiver vazio):

```bash
http POST localhost:3007/api/v1/ocorrencias montadora="Volvo" placa="ABC1D23" descricao="Falha no freio"
http POST localhost:3007/api/v1/ocorrencias montadora="Scania" placa="XYZ4E56" descricao="Vazamento de óleo"
```

Esperado: `201 Created` nos dois.

**Passo 2.** Faça o GET:

```bash
http GET localhost:3007/api/v1/ocorrencias
```

Esperado: `200 OK` e um array com os registros.

**Passo 3.** Valide que é um array (esperado: `true`):

```bash
http --body GET localhost:3007/api/v1/ocorrencias | jq 'type == "array"'
```

**Passo 4.** Valide que o conteúdo é igual ao do arquivo (esperado: `OK`):

```bash
diff <(http --body GET localhost:3007/api/v1/ocorrencias | jq -S .) <(jq -S . ocorrencias.json) && echo OK || echo FALHA
```

**Passo 5 (opcional).** Salve a evidência:

```bash
http --print=hb --pretty=format GET localhost:3007/api/v1/ocorrencias > evidencia_get.txt
cat evidencia_get.txt
```

---

## Exercício 2: Filtrar com `jq` apenas a Scania

**Objetivo:** usar o `jq` para filtrar do `ocorrencias.json` só os registros da montadora "Scania".

```bash
jq '.[] | select(.montadora == "Scania")' ocorrencias.json
```

- `.[]` percorre cada registro do array.
- `select(...)` mantém só os que atendem à condição.
- `.montadora == "Scania"` é a condição.

Para manter o resultado como array:

```bash
jq '[.[] | select(.montadora == "Scania")]' ocorrencias.json
```

Esperado: só o registro da Scania (placa `XYZ4E56`).

---

## Exercício 3: Rota GET `/api/v1/ocorrencias/montadora/:nome`

**Objetivo:** filtrar as ocorrências do arquivo pela montadora informada na URL.

**Código da rota** (em `ocorrencias_api.js`):

```js
// ROTA 3: Filtrar ocorrências por montadora
app.get('/api/v1/ocorrencias/montadora/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const ocorrencias = await lerOcorrencias();
        const filtradas = ocorrencias.filter(
            (o) => o.montadora.toLowerCase() === nome.toLowerCase()
        );
        res.status(200).json(filtradas);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao filtrar ocorrências por montadora." });
    }
});
```

- `req.params.nome` pega o valor que vem na URL.
- `.filter(...)` mantém só as ocorrências da montadora pedida, sem diferenciar maiúsculas de minúsculas.

Se alterou o código, reinicie a API (`Ctrl+C` no Terminal 1 e `node ocorrencias_api.js`).

**Testes** (Terminal 2):

```bash
http GET localhost:3007/api/v1/ocorrencias/montadora/Scania
http GET localhost:3007/api/v1/ocorrencias/montadora/Volvo
http GET localhost:3007/api/v1/ocorrencias/montadora/Ford
```

Esperado:

- Scania: 1 registro
- Volvo: os registros da Volvo
- Ford: `[]`

---

## Exercício 4: Rota DELETE `/api/v1/ocorrencias/:id`

**Objetivo:** remover do arquivo JSON a ocorrência com o ID informado.

**Código da rota** (em `ocorrencias_api.js`):

```js
// ROTA 4: Deletar ocorrência por ID
app.delete('/api/v1/ocorrencias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ocorrencias = await lerOcorrencias();

        const indice = ocorrencias.findIndex((o) => o.id === Number(id));

        if (indice === -1) {
            return res.status(404).json({ erro: `Ocorrência com id ${id} não encontrada.` });
        }

        const [ocorrenciaRemovida] = ocorrencias.splice(indice, 1);
        await salvarOcorrencia(ocorrencias);

        res.status(200).json({
            mensagem: "Ocorrência removida com sucesso.",
            ocorrencia: ocorrenciaRemovida
        });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao remover ocorrência do disco." });
    }
});
```

- `findIndex` procura a posição da ocorrência com o ID. Se não achar, devolve `404`.
- `splice` remove a ocorrência da lista e `salvarOcorrencia` grava o arquivo atualizado.

**Passo 1.** Veja os IDs existentes:

```bash
jq '.[].id' ocorrencias.json
```

**Passo 2.** Remova o primeiro registro (o ID é pego automaticamente do arquivo):

```bash
ID=$(jq '.[0].id' ocorrencias.json)
http DELETE localhost:3007/api/v1/ocorrencias/$ID
```

Esperado: `200 OK` com a mensagem de sucesso.

**Passo 3.** Confirme que sumiu do arquivo:

```bash
cat ocorrencias.json
```

**Passo 4.** Teste um ID que não existe:

```bash
http DELETE localhost:3007/api/v1/ocorrencias/999
```

Esperado: `404 Not Found`.

---

## Exercício 5: Script `limpar_dados.sh`

**Objetivo:** encerrar o processo Node.js e excluir o `ocorrencias.json` para resetar o ambiente de testes.

**Passo 1.** Crie o script:

```bash
cat > limpar_dados.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")" || exit 1

ARQUIVO="ocorrencias.json"
PROCESSO="ocorrencias_api.js"

if pgrep -f "$PROCESSO" > /dev/null; then
  pkill -f "$PROCESSO"
  echo "Processo $PROCESSO encerrado."
else
  echo "Nenhum processo $PROCESSO em execução."
fi

if [ -f "$ARQUIVO" ]; then
  rm "$ARQUIVO"
  echo "Arquivo $ARQUIVO excluído."
else
  echo "Arquivo $ARQUIVO não encontrado."
fi

echo "Ambiente resetado."
EOF
```

**Passo 2.** Dê permissão e execute:

```bash
chmod +x limpar_dados.sh
./limpar_dados.sh
```

**Passo 3.** Confirme o reset:

```bash
pgrep -af ocorrencias_api
ls ocorrencias.json
```

Esperado: o primeiro não mostra nada e o segundo dá `No such file or directory`.

**Passo 4.** Suba a API de novo no Terminal 1:

```bash
node ocorrencias_api.js
```

> O script encerra só o `ocorrencias_api.js`. Nunca use `kill` nos processos de `ps aux | grep node`, porque alguns são do editor do Cloud Shell.

---

## Subir para o Git

```bash
cd ~/curso-pbe1/binario_tech/aula06
echo "node_modules/" >> .gitignore
git add .
git commit -m "Aula 06: persistência em disco com fs/promises e CRUD de ocorrências"
git push origin "$(git branch --show-current)"
```

- `findIndex` procura a posição da ocorrência com o ID. Se não achar, devolve `404`.
- `splice` remove a ocorrência da lista e `salvarOcorrencia` grava o arquivo atualizado.

**Passo 1.** Veja os IDs existentes:

```bash
jq '.[].id' ocorrencias.json
```

**Passo 2.** Remova o primeiro registro (o ID é pego automaticamente do arquivo):

```bash
ID=$(jq '.[0].id' ocorrencias.json)
http DELETE localhost:3007/api/v1/ocorrencias/$ID
```

Esperado: `200 OK` com a mensagem de sucesso.

**Passo 3.** Confirme que sumiu do arquivo:

```bash
cat ocorrencias.json
```

**Passo 4.** Teste um ID que não existe:

```bash
http DELETE localhost:3007/api/v1/ocorrencias/999
```

Esperado: `404 Not Found`.

---

## Exercício 5: Script `limpar_dados.sh`

**Objetivo:** encerrar o processo Node.js e excluir o `ocorrencias.json` para resetar o ambiente de testes.

**Passo 1.** Crie o script:

```bash
cat > limpar_dados.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")" || exit 1

ARQUIVO="ocorrencias.json"
PROCESSO="ocorrencias_api.js"

if pgrep -f "$PROCESSO" > /dev/null; then
  pkill -f "$PROCESSO"
  echo "Processo $PROCESSO encerrado."
else
  echo "Nenhum processo $PROCESSO em execução."
fi

if [ -f "$ARQUIVO" ]; then
  rm "$ARQUIVO"
  echo "Arquivo $ARQUIVO excluído."
else
  echo "Arquivo $ARQUIVO não encontrado."
fi

echo "Ambiente resetado."
EOF
```

**Passo 2.** Dê permissão e execute:

```bash
chmod +x limpar_dados.sh
./limpar_dados.sh
```

**Passo 3.** Confirme o reset:

```bash
pgrep -af ocorrencias_api
ls ocorrencias.json
```

Esperado: o primeiro não mostra nada e o segundo dá `No such file or directory`.

**Passo 4.** Suba a API de novo no Terminal 1:

```bash
node ocorrencias_api.js
```

> O script encerra só o `ocorrencias_api.js`. Nunca use `kill` nos processos de `ps aux | grep node`, porque alguns são do editor do Cloud Shell.

---

## Subir para o Git

```bash
cd ~/curso-pbe1/binario_tech/aula06
echo "node_modules/" >> .gitignore
git add .
git commit -m "Aula 06: persistência em disco com fs/promises e CRUD de ocorrências"
git push origin "$(git branch --show-current)"
```
