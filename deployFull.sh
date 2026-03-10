#!/bin/bash

# ==============================================================================
# CONFIGURAÇÕES
# ==============================================================================
DIR_PROJETO="/root/projetos/slsw"
SERVICE_NAME="slsw"
BRANCH="main"

# ==============================================================================
# EXECUÇÃO
# ==============================================================================
set -e

echo "--- Iniciando Deploy Otimizado: $SERVICE_NAME ---"

cd "$DIR_PROJETO" || { echo "Erro: Pasta não encontrada"; exit 1; }

echo "Sincronizando código..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

echo "--- Diferenças para este deploy ---"
git diff --name-only HEAD@{1} HEAD
echo "-----------------------------------"

echo "Construindo aplicação (Cache Layering)..."
# O uso de --build com o novo Dockerfile ignorará o install se o package.json for igual
docker compose up -d --build $SERVICE_NAME

echo "Limpando lixo de imagens..."
docker image prune -f

echo "--- Logs de inicialização ---"
docker compose logs --tail=30 $SERVICE_NAME

echo "--- Deploy Concluído com Sucesso ---"