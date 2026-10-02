#!/bin/bash
PORT=3007

for f in $(grep -rl "PORT" --include="*.js" . | grep -v node_modules | grep -v aula13_old | grep -v iniciar-mongo); do
  dir=$(dirname "$f")
  file=$(basename "$f")
  echo "== Testando $dir/$file =="

  (cd "$dir" && node "$file" > /tmp/test_output.log 2>&1 &)
  sleep 2

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)
  if [ "$STATUS" = "000" ]; then
    echo "  -> FALHOU ao subir (ver /tmp/test_output.log)"
  else
    echo "  -> respondeu HTTP $STATUS"
  fi

  lsof -ti:$PORT | xargs kill -9 2>/dev/null
  sleep 1
done
