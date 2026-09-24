Aula 19 --- PM2 e Git

Objetivo da aula

Nesta aula foram trabalhados comandos do PM2, configuração de
ambientes, scripts Bash e versionamento de projetos com Git e
GitHub.

Exercício 1 --- Limite de memória com PM2

Objetivo

Limitar o uso de memória do processo api-telemetria a 100 MB. Caso
o processo ultrapasse esse limite, o PM2 poderá reiniciá-lo.

Comando

pm2 start api-telemetria --max-memory-restart 100M

Explicação

pm2 start → inicia a aplicação pelo PM2.

api-telemetria → nome do processo.

--max-memory-restart 100M → define o limite de memória em 100 MB.

Comandos úteis

pm2 list

Lista os processos gerenciados pelo PM2.

pm2 show api-telemetria

Mostra informações detalhadas do processo.

pm2 logs api-telemetria

Exibe os logs da aplicação.

Exercício 2 --- Arquivo Ecosystem do PM2

Objetivo

Criar o arquivo ecosystem.config.js para configurar a aplicação
aula19 e definir variáveis diferentes para os ambientes de
Desenvolvimento e Produção.

Arquivo

ecosystem.config.js

Configuração

module.exports = {
  apps: [
    {
      name: "aula19",
      script: "./app.js",

      env: {
        NODE_ENV: "development",
        PORT: 3000
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};

Explicação

name → nome da aplicação no PM2.

script → arquivo que será executado.

env → configurações do ambiente de Desenvolvimento.

env_production → configurações do ambiente de Produção.

NODE_ENV → identifica o ambiente da aplicação.

PORT → define a porta utilizada.

Executar em Desenvolvimento

pm2 start ecosystem.config.js

Executar em Produção

pm2 start ecosystem.config.js --env production

Exercício 3 --- Auditoria e persistência dos processos

Objetivo

Criar um script Bash para realizar uma auditoria dos processos Node.js,
salvar a configuração atual do PM2 e exibir o resultado registrado no
arquivo de log.

Arquivo

processos.sh

Código

echo "======================================"
echo " AUDITORIA DE SERVIDOR"
echo "======================================"

echo "Listando status de execução dos processos Node.js"
pm2 save

sleep 1

echo "Resultado da Lista:"

cat processos.log

Explicação

echo → exibe mensagens no terminal.

pm2 save → salva a configuração atual dos processos do PM2.

sleep 1 → aguarda 1 segundo antes de continuar.

cat processos.log → exibe o conteúdo do arquivo processos.log.

Dar permissão de execução

chmod +x processos.sh

Executar o script

./processos.sh

Comando principal

pm2 save

Salva a lista atual dos processos gerenciados pelo PM2 para que a
configuração possa ser restaurada posteriormente.

Exercício 4 --- Commit e Push para o GitHub

Objetivo

Versionar as alterações da Aula 19 e enviá-las para a branch main do
GitHub.

1. Verificar as alterações

git status

Mostra os arquivos modificados, adicionados ou ainda não rastreados.

2. Adicionar as alterações

git add .

Adiciona as alterações à área de preparação (staging).

3. Criar o commit

git commit -m "feat: exercícios da aula 19"

Registra as alterações no histórico do Git.

4. Enviar para o GitHub

git push origin main

Envia os commits da branch local main para a branch main do
repositório remoto.

Fluxo completo

git status
git add .
git commit -m "feat: exercícios da aula 19"
git push origin main

📌 Resumo para consulta

Comando                       Função

pm2 start                   Inicia uma aplicação
--max-memory-restart 100M   Define limite de memória de 100 MB
pm2 list                    Lista os processos do PM2
pm2 show                    Mostra informações de um processo
pm2 logs                    Mostra os logs
pm2 save                    Salva os processos atuais
chmod +x                    Dá permissão de execução
./processos.sh              Executa o script Bash
git status                  Verifica o estado do repositório
git add .                   Adiciona alterações ao staging
git commit                  Registra as alterações
git push origin main        Envia alterações para o GitHub

🧠 Fluxo geral da Aula 19

PM2 → Configuração → Script Bash → Git → GitHub

A aula reúne o gerenciamento de aplicações com PM2, a configuração de
diferentes ambientes, a automação com Bash e o versionamento das
alterações utilizando Git e GitHub.
