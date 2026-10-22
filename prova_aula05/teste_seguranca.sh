#!/bin/bash

BASE="http://localhost:3007/api/v1"
CHAVE="binario-tech-secret-2026"
FALHAS=0

testar() {
    local desc="$1" esperado="$2"
    shift 2
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$@")

    if [ "$status" = "$esperado" ]; then
        echo "[OK]    $desc: HTTP $status (esperado $esperado)"
    else
        echo "[FALHA] $desc: HTTP $status (esperado $esperado)"
        FALHAS=$((FALHAS + 1))
    fi
}

echo "===== Auditoria iniciada em $(date '+%Y-%m-%d %H:%M:%S') ====="

# 1. Sem chave
testar "1. Motoristas SEM chave" 401 "$BASE/motoristas"

# 2. Chave invalida
testar "2. Motoristas com chave INVALIDA" 401 -H "X-API-KEY: chave-errada" "$BASE/motoristas"

# 3. CNH invalida com chave valida
testar "3. Cadastro com CNH invalida (123)" 400 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type: application/json" \
    -d '{"nome":"Carlos","cnh":"123","categoria":"E"}' "$BASE/motoristas"

# 4. Rota inexistente
testar "4. Rota inexistente /clientes" 404 "$BASE/clientes"

# 5. Consultas e cadastros validos
testar "5a. GET motoristas com chave valida" 200 -H "X-API-KEY: $CHAVE" "$BASE/motoristas"

testar "5b. POST motorista valido" 201 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type: application/json" \
    -d '{"nome":"Carlos","cnh":"12345678901","categoria":"E"}' "$BASE/motoristas"

testar "5c. GET manutencoes com chave valida" 200 -H "X-API-KEY: $CHAVE" "$BASE/manutencoes"

testar "5d. POST manutencao valida" 201 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type:
cd ~/binario_tech/prova_aula05

cat > teste_seguranca.sh << 'EOF'
#!/bin/bash

BASE="http://localhost:3007/api/v1"
CHAVE="binario-tech-secret-2026"
FALHAS=0

testar() {
    local desc="$1" esperado="$2"
    shift 2
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$@")

    if [ "$status" = "$esperado" ]; then
        echo "[OK]    $desc: HTTP $status (esperado $esperado)"
    else
        echo "[FALHA] $desc: HTTP $status (esperado $esperado)"
        FALHAS=$((FALHAS + 1))
    fi
}

echo "===== Auditoria iniciada em $(date '+%Y-%m-%d %H:%M:%S') ====="

# 1. Sem chave
testar "1. Motoristas SEM chave" 401 "$BASE/motoristas"

# 2. Chave invalida
testar "2. Motoristas com chave INVALIDA" 401 -H "X-API-KEY: chave-errada" "$BASE/motoristas"

# 3. CNH invalida com chave valida
testar "3. Cadastro com CNH invalida (123)" 400 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type: application/json" \
    -d '{"nome":"Carlos","cnh":"123","categoria":"E"}' "$BASE/motoristas"

# 4. Rota inexistente
testar "4. Rota inexistente /clientes" 404 "$BASE/clientes"

# 5. Consultas e cadastros validos
testar "5a. GET motoristas com chave valida" 200 -H "X-API-KEY: $CHAVE" "$BASE/motoristas"

testar "5b. POST motorista valido" 201 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type: application/json" \
    -d '{"nome":"Carlos","cnh":"12345678901","categoria":"E"}' "$BASE/motoristas"

testar "5c. GET manutencoes com chave valida" 200 -H "X-API-KEY: $CHAVE" "$BASE/manutencoes"

testar "5d. POST manutencao valida" 201 -X POST \
    -H "X-API-KEY: $CHAVE" -H "Content-Type: application/json" \
    -d '{"placa":"ABC-1234","descricao":"Revisao dos freios","valor":980.5}' "$BASE/manutencoes"

echo ""
if [ "$FALHAS" -eq 0 ]; then
    echo "Todos os testes passaram."
else
    echo "$FALHAS teste(s) falharam."
    exit 1
fi
