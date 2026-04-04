#!/bin/bash
# Restauração de imagens do RPG Manager

BACKUP_DIR="/home/gustavo/projetos/rpg-manager/backups"
LATEST_BACKUP="$BACKUP_DIR/upload_backup_latest.tar.gz"

if [ ! -f "$LATEST_BACKUP" ]; then
  echo "❌ Nenhum backup encontrado em: $LATEST_BACKUP"
  echo "Verifique se há backups em: $BACKUP_DIR"
  exit 1
fi

echo "🔄 Restaurando imagens de backup..."
echo "📦 Backup: $LATEST_BACKUP"

# Parar o container Docker (opcional, mas recomendado)
echo "⏹️  Parando container Docker..."
docker-compose down

# Fazer backup do atual antes de substituir (por segurança)
echo "💾 Salvando uploads atuais como backup de segurança..."
if [ -d "public/uploads" ] && [ "$(ls -A public/uploads 2>/dev/null)" ]; then
  mkdir -p "$BACKUP_DIR/pre-restore-backup"
  cp -r public/uploads "$BACKUP_DIR/pre-restore-backup/uploads_$(date +%Y%m%d_%H%M%S)"
fi

# Restaurar
echo "📥 Restaurando arquivos..."
rm -rf public/uploads
tar -xzf "$LATEST_BACKUP" -C .

echo "✅ Restauração concluída!"
echo "🚀 Iniciando container..."
docker-compose up -d

echo "✨ Pronto! Imagens restauradas."
echo ""
echo "📋 Verifique se os arquivos estão corretos:"
ls -lah public/uploads/ | head -20
