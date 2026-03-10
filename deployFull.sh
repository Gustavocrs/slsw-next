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

echo "--- [FULL DEPLOY] Iniciando Build Standalone: $SERVICE_NAME ---"

if [ ! -d "$DIR_PROJETO" ]; then
    echo "Erro: Diretório $DIR_PROJETO não encontrado."
    exit 1
fi

cd "$DIR_PROJETO"

echo "1. Sincronizando repositório..."
git fetch $REMOTE $BRANCH
git pull $REMOTE $BRANCH

echo "2. Iniciando Build e Up (Aproveitando cache de camadas)..."
docker compose up -d --build $SERVICE_NAME

echo "3. Limpeza de imagens órfãs..."
docker image prune -f

echo "--- Logs de Inicialização ---"
docker compose logs --tail=$LOG_TAIL $SERVICE_NAME

echo "--- Deploy Full Concluído ---"