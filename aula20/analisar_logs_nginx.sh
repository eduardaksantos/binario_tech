#!/bin/bash

# Lê as últimas 15 linhas do arquivo de access log do Nginx e filtra apenas as que possuem o status HTTP 200
tail -n 15 /var/log/nginx/access.log | grep " 200 "
