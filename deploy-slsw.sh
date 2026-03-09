#!/bin/bash

# ==============================================================================
# SCRIPT DE DEPLOY - PROJETO SLSW (NEXT.JS) - V2.0 (Resiliente)
# Senior FullStack Engineer Mode
# ==============================================================================

# Interrompe o script em caso de erro
set -e

DIR_PROJETO="$HOME/projetos/slsw"
BRANCH="main"
NETWORK_NAME="slsw-network"

export COMPOSE_IGNORE_ORPHANS=True

echo "--- [1/6] Verificação de Recursos do Sistema ---"
# Verifica Inodes e Espaço (Evita o erro 'no space left on device')
CHECK_INODES=$(df -i / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$CHECK_INODES" -gt 95 ]; then
    echo "Erro: Limite de Inodes atingido ($CHECK_INODES%). Limpando cache do Docker..."
    docker builder prune -f
fi

echo "--- [2/6] Acessando diretório do projeto ---"
if [ -d "$DIR_PROJETO" ]; then
    cd "$DIR_PROJETO" || exit
else
    echo "Erro: Diretório $DIR_PROJETO não encontrado."
    exit 1
fi

echo "--- [3/6] Sincronização Git ($BRANCH) ---"
git fetch origin
git checkout $BRANCH
git reset --hard origin/$BRANCH
git clean -fd

echo "--- [4/6] Verificando Infraestrutura de Rede ---"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Criando rede externa: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
fi

echo "--- [5/6] Reiniciando Serviço slsw ---"
# Limpeza de estados inconsistentes antes do build
docker compose down --remove-orphans

# Build sem cache para garantir integridade após erro de disco
docker compose build --no-cache

# Sobbe o container em modo detached
docker compose up -d

echo "--- [6/6] Manutenção de Espaço ---"
# Remove imagens órfãs e cache de build antigo para liberar Inodes
docker image prune -f
docker builder prune -f --filter "until=24h"

echo "Aguardando 5s para verificação de logs..."
sleep 5
docker compose logs --tail=20 slsw
docker compose ps

echo "--- Deploy Finalizado com Sucesso ---"