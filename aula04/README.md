# Aula 04: API REST de Frota (CRUD)

Guia de consulta rápida para a prova (exercícios 1 a 8).
Repositório: `~/curso-pbe1/binario_tech` | Pasta: `aula04` | Arquivo da API: `frota_api.js`

## Preparação

Descobrir porta e rotas da API:

```bash
cd ~/curso-pbe1/binario_tech/aula04
grep -n "PORT\|listen" frota_api.js
grep -n "app\.\(get\|post\|put\|patch\|delete\)" frota_api.js
```

Subir a API:

```bash
npm install
node frota_api.js &
```

Atenção: a `aula21` (processo `api-cicd` no PM2) usa a porta 3007. Se a aula04 usar a mesma porta, pare a outra antes e religue depois:

```bash
pm2 stop api-cicd          # antes
pm2 start api-cicd         # depois, para religar a aula21
```

Para parar a API da aula04 que está em segundo plano: `kill %1` (ou `pkill -f frota_api.js`).

Variável usada nos comandos abaixo (ajuste a porta se for diferente):

```bash
BASE="http://localhost:3007/api/v1/veiculos"
```

O enunciado cita a porta 3000. Use a porta que o `grep` acima mostrou.

Os campos do JSON (`montadora`, `modelo`, `placa`, `status`) devem seguir o que a `frota_api.js` espera. Confira no código e ajuste se os nomes forem diferentes.

## Exercício 1: GET de um veículo (ID 1) com jq

```bash
curl -s $BASE/1 | jq .
```

Esperado: JSON formatado do veículo 1. Se aparecer `command not found: jq`, instale: `sudo apt install -y jq`.

## Exercício 2: POST de um caminhão Volvo (status 201)

```bash
curl -i -X POST $BASE \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540","placa":"KLL-9090"}'
```

Esperado: `HTTP/1.1 201 Created` e o veículo no corpo da resposta.

Só o código de status:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540","placa":"KLL-9091"}'
```

Se a API bloquear placa repetida, troque a placa em cada teste.

## Exercício 3: POST sem o campo placa (status 400)

```bash
curl -i -X POST $BASE \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540"}'
```

Esperado: `HTTP/1.1 400 Bad Request` e uma mensagem de erro dizendo que a placa é obrigatória.

Se retornar 201, falta a validação no `POST`:

```js
if (!req.body.placa) {
  return res.status(400).json({ erro: "O campo 'placa' é obrigatório." });
}
```

## Exercício 4: GET filtrando por query param

```bash
curl -s "$BASE?status=DISPONIVEL" | jq .
```

Use aspas na URL: sem elas o `&` e o `?` podem ser interpretados pelo terminal. Esperado: só veículos com `status` igual a `DISPONIVEL`.

## Exercício 5: PATCH do status do ID 3 para EM_ROTA

```bash
curl -s -X PATCH $BASE/3 \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' | jq .
```

Conferir:

```bash
curl -s $BASE/3 | jq .status
```

Esperado: `"EM_ROTA"`.

## Exercício 6: ID inexistente retorna 404

```bash
# PATCH
curl -s -o /dev/null -w "PATCH: %{http_code}\n" -X PATCH $BASE/99 \
  -H "Content-Type: application/json" -d '{"status":"EM_ROTA"}'

# DELETE
curl -s -o /dev/null -w "DELETE: %{http_code}\n" -X DELETE $BASE/99
```

Esperado: `404` nos dois. Se retornar outro código, a rota precisa checar se o veículo existe:

```js
if (!veiculo) {
  return res.status(404).json({ erro: "Veículo não encontrado." });
}
```

## Exercício 7: nova rota PUT (substitui todos os dados)

Adicionar no `frota_api.js`, antes do `app.listen`. Adapte `veiculos` ao nome do array/lista que o seu código usa:

```js
app.put('/api/v1/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = veiculos.findIndex(v => v.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Veículo não encontrado." });
  }

  const { montadora, modelo, placa, status } = req.body;
  if (!montadora || !modelo || !placa || !status) {
    return res.status(400).json({ erro: "PUT exige todos os campos: montadora, modelo, placa e status." });
  }

  veiculos[indice] = { id, montadora, modelo, placa, status };
  res.status(200).json(veiculos[indice]);
});
```

Diferença entre os métodos:

| Método | Efeito |
|---|---|
| PUT | substitui o registro inteiro (todos os campos obrigatórios) |
| PATCH | altera só os campos enviados |

Reinicie a API e teste:

```bash
curl -s -X PUT $BASE/1 \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Scania","modelo":"R450","placa":"ABC-1234","status":"DISPONIVEL"}' | jq .
```

Esperado: `200` com o veículo substituído.

## Exercício 8: script teste_crud.sh com log

Salvar como `teste_crud.sh` na `aula04` e dar permissão: `chmod +x teste_crud.sh`

```bash
#!/bin/bash
BASE="http://localhost:3007/api/v1/veiculos"
LOG="crud_result.log"
H="Content-Type: application/json"
: > "$LOG"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"; }

log "1) Cadastrando veiculo A"
RA=$(curl -s -w "\n%{http_code}" -X POST "$BASE" -H "$H" \
  -d '{"montadora":"Volvo","modelo":"FH 540","placa":"AAA-1111","status":"DISPONIVEL"}')
BODY_A=$(echo "$RA" | sed '$d'); log "HTTP $(echo "$RA" | tail -n1) - $BODY_A"
ID_A=$(echo "$BODY_A" | jq -r '.id // .veiculo.id // .dados.id')

log "2) Cadastrando veiculo B"
RB=$(curl -s -w "\n%{http_code}" -X POST "$BASE" -H "$H" \
  -d '{"montadora":"Scania","modelo":"R450","placa":"BBB-2222","status":"DISPONIVEL"}')
BODY_B=$(echo "$RB" | sed '$d'); log "HTTP $(echo "$RB" | tail -n1) - $BODY_B"
ID_B=$(echo "$BODY_B" | jq -r '.id // .veiculo.id // .dados.id')

log "3) Atualizando veiculo A (id $ID_A) para EM_ROTA"
RU=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE/$ID_A" -H "$H" -d '{"status":"EM_ROTA"}')
log "HTTP $(echo "$RU" | tail -n1) - $(echo "$RU" | sed '$d')"

log "4) Deletando veiculo B (id $ID_B)"
RD=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE/$ID_B")
log "HTTP $(echo "$RD" | tail -n1) - $(echo "$RD" | sed '$d')"

log "Fim do teste. Log salvo em $LOG"
```

Rodar:

```bash
./teste_crud.sh
cat crud_result.log
```

Esperado: cadastros com `201`, atualização com `200`, exclusão com `200` ou `204`.

## Tabela de status HTTP da aula

| Código | Significado | Quando |
|---|---|---|
| 200 | OK | GET, PUT, PATCH com sucesso |
| 201 | Created | POST criou o recurso |
| 204 | No Content | DELETE sem corpo de resposta |
| 400 | Bad Request | campo obrigatório ausente |
| 404 | Not Found | ID inexistente |

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `Connection refused` / status `000` | API fora do ar ou porta errada: `grep -n listen frota_api.js` |
| `EADDRINUSE` | porta ocupada: `pm2 stop api-cicd` ou `pkill -f frota_api.js` |
| `jq: command not found` | `sudo apt install -y jq` |
| POST retorna 400 mesmo com placa | falta o header `Content-Type: application/json` |
| `ID_A` vazio no script | veja o corpo do POST e ajuste o caminho do `jq` (`.id`, `.veiculo.id`...) |
| URL com `?` quebra no terminal | colocar a URL entre aspas |
| `curl` do PUT dá `Cannot PUT` | rota não foi adicionada ou a API não foi reiniciada |

## Pontos que caem na prova

1. POST cria (201), GET lê (200), PUT substitui tudo, PATCH altera parte, DELETE remove.
2. `Content-Type: application/json` é obrigatório no POST, PUT e PATCH.
3. Validação de campo obrigatório retorna 400; recurso inexistente retorna 404.
4. Query param vem depois do `?` e várias condições se juntam com `&`.
5. `curl -i` mostra os cabeçalhos e o status; `-s -o /dev/null -w "%{http_code}"` mostra só o código.
6. Reinicie a API depois de editar o `frota_api.js`.
7. Não versione `node_modules`, `.env` nem `*.log`.
