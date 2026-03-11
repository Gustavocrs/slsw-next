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

echo "--- [UPDATE & APPLY] Atualizando e aplicando mudanças: $SERVICE_NAME ---"

cd "$DIR_PROJETO"

echo "1. Sincronizando Git..."
git fetch $REMOTE $BRANCH
git reset --hard $REMOTE/$BRANCH
git clean -fd

echo "2. Reconstruindo apenas o necessário..."
# O segredo: 'up -d --build' aplica as mudanças de código que você baixou
docker compose up -d --build $SERVICE_NAME

echo "3. Limpando imagens antigas..."
docker image prune -f

echo "--- Logs Recentes ---"
docker compose logs --tail=$LOG_TAIL $SERVICE_NAME

echo "--- Processo Finalizado ---"