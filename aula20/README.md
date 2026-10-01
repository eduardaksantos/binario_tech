Guia Prático de Comandos: Nginx, PM2 e Bash (Lições 1 a 4)

Este documento reúne o passo a passo completo e comentado dos comandos essenciais desenvolvidos nas aulas, servindo como uma cola rápida para consultas durante avaliações práticas.

Sumário

Lição 1: Gerenciamento de Processos com PM2

Lição 2: Criação e Configuração de Rotas no Nginx

Lição 3: Limite de Payload e Testes com Arquivos Binários

Lição 4: Automação com Script Bash para Análise de Logs

Lição 1: Gerenciamento de Processos com PM2

Utilizado para manter sua aplicação Node.js rodando em segundo plano (background) e gerenciar seu ciclo de vida.

1. Iniciar e nomear uma aplicação

pm2 start server.js --name "api-proxy-node"


pm2 start: Comando para iniciar o script.

server.js: Arquivo de entrada (entry point) da aplicação.

--name: Atribui um nome amigável ao processo para facilitar o monitoramento.

2. Listar e monitorar processos ativos

pm2 list


Exibe a tabela de processos com status, uso de CPU, memória e ID.

Lição 2: Criação e Configuração de Rotas no Nginx

Criação de blocos personalizados (location) que respondem diretamente pelo Nginx, sem acionar a aplicação Node.js.

1. Abrir o arquivo de configuração principal da rota

sudo nano /etc/nginx/sites-available/binario_aluno.conf


2. Adicionar uma rota estática em JSON (/status-nginx)

Dentro do bloco server { ... }, insira o seguinte trecho:

location /status-nginx {
    default_type application/json;
    return 200 '{"status": "success", "message": "Nginx esta rodando perfeitamente!", "code": 200}';
}


3. Testar a sintaxe do Nginx

Sempre execute este comando após alterar qualquer arquivo de configuração:

sudo nginx -t


4. Recarregar o Nginx (Ambientes sem Systemd / WSL)

Se o systemctl reload nginx retornar erro de PID 1, utilize:

sudo nginx -s reload


5. Testar a rota criada com o curl

curl -s http://localhost:8080/status-nginx | jq .


-s: Modo silencioso.

| jq .: Formata e colore a resposta JSON no terminal.

Lição 3: Limite de Payload e Testes com Arquivos Binários

Proteção do servidor contra requisições excessivamente grandes (payloads abusivos).

1. Configurar o limite de tamanho no Nginx

Adicione a diretiva diretamente dentro do bloco server { ... } no arquivo .conf:

client_max_body_size 2M;


(Valide com sudo nginx -t e recarregue com sudo nginx -s reload).

2. Gerar arquivos de teste binários (dd)

Crie arquivos de tamanhos específicos para validar o bloqueio:

Arquivo menor que o limite (1 MB):

dd if=/dev/zero of=pequeno.bin bs=1M count=1


Arquivo maior que o limite (3 MB):

dd if=/dev/zero of=grande.bin bs=1M count=3


3. Testar o envio dos arquivos via curl

Esperado sucesso (HTTP 200):

curl -i -X POST --data-binary @pequeno.bin http://localhost:8080/api/v1/proxy/info


Esperado erro de payload excedido (HTTP 413 Request Entity Too Large):

curl -i -X POST --data-binary @grande.bin http://localhost:8080/api/v1/proxy/info


Lição 4: Automação com Script Bash para Análise de Logs

Criação de scripts para inspecionar logs de acesso do servidor web rapidamente.

1. Criar o arquivo de script

nano analisar_logs_nginx.sh


2. Inserir o código do script

Cole o conteúdo abaixo no arquivo:

#!/bin/bash

# Lê as últimas 15 linhas do log de acesso e filtra apenas requisições com status HTTP 200
tail -n 15 /var/log/nginx/access.log | grep " 200 "


3. Dar permissão de execução

chmod +x analisar_logs_nginx.sh


4. Executar o script

./analisar_logs_nginx.sh


(Nota: Se houver restrição de permissão de leitura nos logs do sistema, utilize sudo ./analisar_logs_nginx.sh)
