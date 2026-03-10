#!/bin/bash

# ==============================================================================
# CONFIGURAÇÕES
# ==============================================================================
DIR_PROJETO="/root/projetos/slsw"
SERVICE_NAME="slsw"
REMOTE="origin"
BRANCH="main"
LOG_TAIL=50

# ==============================================================================
# EXECUÇÃO
# ==============================================================================
set -e

echo "--- Iniciando Deploy Full: $SERVICE_NAME ---"

if [ ! -d "$DIR_PROJETO" ]; then
    echo "Erro: Diretório $DIR_PROJETO não encontrado."
    exit 1
fi

cd "$DIR_PROJETO"

echo "1. Atualizando repositório..."
git fetch $REMOTE $BRANCH
git pull $REMOTE $BRANCH

echo "2. Mudanças detectadas:"
git diff --name-only HEAD@{1} HEAD

echo "3. Iniciando Build e Up (Recreation)..."
# O --build força a recriação da imagem antes de subir
docker compose up -d --build $SERVICE_NAME

echo "4. Limpeza de imagens 'dangling' (órfãs)..."
docker image prune -f

echo "--- Logs de Verificação ---"
docker compose logs --tail=$LOG_TAIL $SERVICE_NAME

echo "--- Deploy Concluído com Sucesso ---"
