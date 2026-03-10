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

echo "--- Restart rápido: $SERVICE_NAME ---"

# Valida diretório
if [ ! -d "$DIR_PROJETO" ]; then
    echo "Erro: Diretório $DIR_PROJETO não existe."
    exit 1
fi

cd "$DIR_PROJETO"

echo "Sincronizando código ($REMOTE/$BRANCH)..."
git fetch $REMOTE $BRANCH
git pull $REMOTE $BRANCH

echo "Reiniciando serviço Docker..."
docker compose restart $SERVICE_NAME

echo "--- Logs Recentes ($LOG_TAIL linhas) ---"
docker compose logs --tail=$LOG_TAIL $SERVICE_NAME

echo "--- Processo Finalizado ---"
