#!/bin/bash

# ==============================================================================
# CONFIGURAÇÕES
# ==============================================================================
DIR_PROJETO="/root/projetos/slsw"
SERVICE_NAME="slsw"
REMOTE="origin"
BRANCH="main"

# ==============================================================================
# EXECUÇÃO
# ==============================================================================
set -e
cd "$DIR_PROJETO"

echo "--- [SMART UPDATE] Verificando melhor caminho de deploy ---"

git fetch $REMOTE $BRANCH

# Verifica se o package.json ou Dockerfile mudaram
NEEDS_BUILD=$(git diff --name-only HEAD $REMOTE/$BRANCH | grep -E "package.json|package-lock.json|Dockerfile" || true)

git pull $REMOTE $BRANCH

if [ -n "$NEEDS_BUILD" ]; then
    echo "⚠️  Detectadas mudanças em dependências ou infra. Iniciando Build Full..."
    docker compose up -d --build $SERVICE_NAME
else
    echo "🚀 Apenas mudanças de código. Usando Restart Rápido (Hot Reload)..."
    docker compose restart $SERVICE_NAME
fi

echo "--- Processo Concluído ---"