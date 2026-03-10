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

echo "--- [HOT RESTART] Atualização rápida de código: $SERVICE_NAME ---"

if [ ! -d "$DIR_PROJETO" ]; then
    echo "Erro: Diretório $DIR_PROJETO não encontrado."
    exit 1
fi

cd "$DIR_PROJETO"

echo "1. Puxando mudanças do Git..."
git fetch $REMOTE $BRANCH
git pull $REMOTE $BRANCH

echo "2. Reiniciando serviço (Sem rebuild)..."
docker compose restart $SERVICE_NAME

echo "--- Logs Recentes ---"
docker compose logs --tail=$LOG_TAIL $SERVICE_NAME

echo "--- Processo Finalizado ---"