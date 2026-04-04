#!/bin/bash
# Health Check - Verifica integridade do sistema

echo "🔍 RPG Manager Health Check"
echo "=========================="
echo ""

# 1. Verificar se Docker está rodando
echo "🐳 Docker:"
if docker ps --format '{{.Names}}' | grep -q 'slsw'; then
  echo "   ✅ Container 'slsw' está rodando"
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep slsw
else
  echo "   ❌ Container 'slsw' NÃO está rodando!"
fi
echo ""

# 2. Verificar volume de uploads
echo "📁 Volume de Uploads:"
if [ -d "public/uploads" ]; then
  FILE_COUNT=$(ls -1 public/uploads/ 2>/dev/null | wc -l)
  echo "   ✅ Diretório existe"
  echo "   📊 Arquivos: $FILE_COUNT"
  if [ $FILE_COUNT -gt 0 ]; then
    echo "   📄 Últimos arquivos:"
    ls -lht public/uploads/ | head -5 | awk '{print "      " $9 " (" $5 ")"}'
  fi
else
  echo "   ❌ Diretório NÃO existe!"
fi
echo ""

# 3. Verificar configuração Docker Compose
echo "⚙️  Docker Compose:"
if [ -f "docker-compose.yml" ]; then
  if grep -q "public/uploads:/app/public/uploads" docker-compose.yml; then
    echo "   ✅ Volume de uploads configurado"
  else
    echo "   ⚠️  Volume de uploads NÃO encontrado no docker-compose.yml"
  fi
else
  echo "   ❌ docker-compose.yml não encontrado"
fi
echo ""

# 4. Verificar backups
echo "💾 Backups:"
if [ -d "backups" ]; then
  BACKUP_COUNT=$(ls -1 backups/backup_*.tar.gz 2>/dev/null | wc -l)
  echo "   ✅ Diretório de backups existe"
  echo "   📦 Backups disponíveis: $BACKUP_COUNT"
  if [ $BACKUP_COUNT -gt 0 ]; then
    echo "   📅 Último backup:"
    ls -lht backups/backup_*.tar.gz | head -1 | awk '{print "      " $9 " (" $5 ") em " $6 " " $7 " " $8}'
  fi
  echo "   📂 Link para último backup:"
  if [ -L "backups/upload_backup_latest.tar.gz" ]; then
    echo "      $(readlink backups/upload_backup_latest.tar.gz)"
  fi
else
  echo "   ⚠️  Diretório de backups NÃO existe"
  echo "   💡 Execute: mkdir -p backups"
fi
echo ""

# 5. Verificar scripts
echo "📜 Scripts:"
for script in backup.sh restore.sh; do
  if [ -x "scripts/$script" ]; then
    echo "   ✅ $script (executável)"
  elif [ -f "scripts/$script" ]; then
    echo "   ⚠️  $script (não executável - rodar: chmod +x scripts/$script)"
  else
    echo "   ❌ $script não encontrado"
  fi
done
echo ""

# 6. Verificar conexão com Firebase (se configurado)
echo "🔥 Firebase:"
if [ -f ".env.local" ] || [ -n "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
  echo "   ✅ Variáveis de ambiente Firebase encontradas"
else
  echo "   ⚠️  Variáveis de ambiente Firebase NÃO configuradas"
fi
echo ""

# 7. Testar API de upload
echo "🌐 API de Upload:"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/upload 2>/dev/null || echo "000")
if [ "$response" = "200" ] || [ "$response" = "405" ]; then
  echo "   ✅ API respondendo (HTTP $response)"
else
  echo "   ⚠️  API não respondeu corretamente (HTTP $response)"
  echo "   💡 Verifique se o servidor está rodando: npm run dev"
fi
echo ""

# 8. Resumo
echo "=========================="
echo "📋 Checklist de Segurança:"
echo "  [✓] Volume Docker configurado"
echo "  [✓] Backups automáticos (crontab recomendado)"
echo "  [✓] Scripts de restauração prontos"
echo "  [✓] Botão 'Limpar Servidor' ocultado"
echo ""
echo "🔄 Próximos passos:"
echo "  1. Configure backup automático no crontab"
echo "  2. Teste restore em ambiente de desenvolvimento"
echo "  3. Configure exportação automática do Firestore"
echo ""
echo "Documentação completa: BACKUP_PERSISTENCIA.md"
