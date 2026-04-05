# 📦 Backup e Persistência de Dados - RPG Manager

## 📁 O que é persistido?

### 1. Imagens e Arquivos Uploadados
- Local: `public/uploads/`
- Tipos: IMG-*.png/jpg (imagens de personagens), FILE-*.pdf (arquivos anexados)
- **JÁ TEM VOLUME DOCKER**: `./public/uploads:/app/public/uploads` (docker-compose.yml:29)

### 2. Dados do Firestore (REAL-TIME via Firebase)
- Cenários, mesas, personagens, convites, mensagens
- **Backup automático do Firebase**: Ative no console
- Exportação manual via CLI: `firebase database:get / --token TOKEN > backup.json`

## 🗂️ Estrutura de Backup

```
backups/
├── backup_YYYYMMDD_HHMMSS-uploads.tar.gz  # Backup completo das imagens
├── backup_YYYYMMDD_HHMMSS-env.local       # Backup das variáveis de ambiente
├── upload_backup_latest.tar.gz            # Symlink para último backup
└── pre-restore-backup/                    # Backup de segurança pré-restauração
```

## 🔄 Como Fazer Backup

### Automático (Recomendado) - Adicione ao crontab:

```bash
# Backup diário às 2h da manhã
0 2 * * * cd /home/gustavo/projetos/rpg-manager && ./scripts/backup.sh >> /var/log/rpg-manager-backup.log 2>&1
```

### Manual:
```bash
cd /home/gustavo/projetos/rpg-manager
./scripts/backup.sh
```

## ♻️ Como Restaurar

```bash
cd /home/gustavo/projetos/rpg-manager
./scripts/restore.sh
```

O script irá:
1. Parar o container Docker
2. Fazer backup de segurança dos uploads atuais
3. Restaurar do último backup
4. Reiniciar o container

## ☁️ No VPS (Ubuntu/Debian)

### 1. Volume Docker (já configurado)
O `docker-compose.yml` já monta o volume local:
```yaml
volumes:
  - ./public/uploads:/app/public/uploads
```

Isso garante que os arquivos **não são perdidos** ao recriar o container.

### 2. Backup Remoto (opcional)
adicione ao crontab para enviar para cloud:

```bash
# Exemplo com rclone (Google Drive, S3, etc)
0 3 * * * tar -czf /tmp/rpg-uploads-$(date +%Y%m%d).tar.gz public/uploads && rclone copy /tmp/rpg-uploads-*.tar.gz remote:backup-bucket/
```

### 3. Backup do Firestore
Use o **Firebase Console** para agendar exportações diárias para Google Cloud Storage:
- Console Firebase → Firestore Database → Export/Import
- Configure exportação agendada

## ⚠️ Antes de Resetar o Docker

### NÃO FAÇA:
```bash
docker-compose down -v  # Isso APAGA volumes!
docker-compose rm -v    # Isso APAGA volumes!
```

### FAÇA:
```bash
docker-compose down     # Apenas para o container, volumes permanecem
docker-compose up -d    # Recria, volumes são mantidos
```

## 🛡️ Proteções Implementadas

1. **Ocultação do botão "Limpar Servidor"** - Evita limpeza acidental
2. `cleanupUnusedFiles()` - Verifica referências no Firestore antes de deletar
3. Volume Docker configurado - Uploads persistem no host
4. Scripts de backup - Backup automático via cron
5. Backup de segurança pré-restauração

## 📝 Monitoramento

### Verificar espaço em disco:
```bash
du -sh public/uploads/
```

### Ver arquivos mais recentes:
```bash
ls -lht public/uploads/ | head -20
```

### Logs de backup:
```bash
tail -f /var/log/rpg-manager-backup.log
```

## 🔧 scripts/backup.sh
Backup completo das imagens + .env.local + instruções para Firestore.

## 🔧 scripts/restore.sh
Restaura imagens do último backup com segurança.

## 🆘 Em Caso de Perda de Dados

1. **Imagens**: Restaurar de `backups/upload_backup_latest.tar.gz`
2. **Firestore**: Importar do backup do Firebase Console
3. **Variáveis**: Restaurar `.env.local` de backup

---

**Última atualização**: 2026-04-03
**Responsável**: Dev Team
