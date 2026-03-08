#!/bin/bash

# ==============================================================================
# SCRIPT DE DEPLOY - PROJETO SLSW (NEXT.JS)
# Senior FullStack Engineer Mode
# ==============================================================================

DIR_PROJETO="$HOME/projetos/slsw"
BRANCH="main"
NETWORK_NAME="slsw-network"

export COMPOSE_IGNORE_ORPHANS=True

echo "--- [1/5] Acessando diretório do projeto ---"

if [ -d "$DIR_PROJETO" ]; then
    cd "$DIR_PROJETO" || exit
else
    echo "Erro: Diretório $DIR_PROJETO não encontrado."
    exit 1
fi

echo "--- [2/5] Sincronização Git ($BRANCH) ---"
git fetch origin
git checkout $BRANCH
git reset --hard origin/$BRANCH
git clean -fd

echo "--- [3/5] Verificando Infraestrutura de Rede ---"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Criando rede externa: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
fi

echo "--- [4/5] Reiniciando Serviço slsw ---"

# Remove containers órfãos e força o build sem cache para evitar arquivos corrompidos
docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d

echo "--- [5/5] Limpeza de Imagens Órfãs ---"
docker image prune -f

echo "Aguardando 5s para verificação de logs..."
sleep 5
docker compose logs --tail=20 slsw
docker compose ps

echo "--- Deploy Finalizado com Sucesso ---"