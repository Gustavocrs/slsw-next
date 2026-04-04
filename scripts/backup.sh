#!/bin/bash
# Backup de imagens e dados do RPG Manager
# Exporta dados críticos para backup

BACKUP_DIR="/home/gustavo/projetos/rpg-manager/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE"

echo "🔄 Iniciando backup do RPG Manager..."

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# 1. Backup da pasta de uploads (imagens)
echo "📁 Backup das imagens..."
rsync -av --delete "$BACKUP_DIR"/upload_backup_latest/ ./public/uploads/ 2>/dev/null || true
tar -czf "$BACKUP_DIR/$BACKUP_NAME-uploads.tar.gz" public/uploads/
echo "✅ Imagens salvas em: $BACKUP_DIR/$BACKUP_NAME-uploads.tar.gz"

# 2. Backup do banco de dados Firestore (instruções)
echo "📊 Backup do Firestore:"
echo "   Use o Firebase Console para exportar dados:"
echo "   https://console.firebase.google.com/project/seu-projeto/firestore/export"
echo "   OU use a CLI: firebase database:get / --token YOUR_TOKEN > backup_firestore.json"

# 3. Backup do arquivo .env.local (variáveis de ambiente importantes)
if [ -f .env.local ]; then
  cp .env.local "$BACKUP_DIR/$BACKUP_NAME-env.local"
  echo "🔐 Variáveis de ambiente salvas em: $BACKUP_DIR/$BACKUP_NAME-env.local"
fi

# 4. Criar symlink para o último backup (facilita restauração)
ln -sf "$BACKUP_DIR/$BACKUP_NAME-uploads.tar.gz" "$BACKUP_DIR/upload_backup_latest.tar.gz"
rm -rf "$BACKUP_DIR/upload_backup_latest"
cp -r public/uploads "$BACKUP_DIR/upload_backup_latest" 2>/dev/null || true

# 5. Limpar backups antigos (manter últimos 30 dias)
echo "🧹 Limpando backups antigos..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -mtime +30 -delete
find "$BACKUP_DIR" -name "*_env.local" -type f -mtime +30 -delete

echo "✨ Backup concluído!"
echo "📦 Arquivos gerados:"
ls -lh "$BACKUP_DIR" | grep "$BACKUP_NAME"
