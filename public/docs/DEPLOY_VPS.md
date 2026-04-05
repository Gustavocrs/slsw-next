# 🚀 Deploy no VPS - Guia de Persistência

## 📋 Pré-requisitos

- Docker & Docker Compose instalados
- Acesso SSH ao servidor
- Variáveis de ambiente configuradas no `.env.local` (copiadas do ambiente local)

## 📦 Passo a Passo

### 1. Transferir Código
```bash
# No VPS, clone o repositório
cd /opt
git clone <seu-repo> rpg-manager
cd rpg-manager
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copie do ambiente local ou configure manualmente
nano .env.local
```

Variáveis necessárias (veja `.env.example`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
...
```

### 3. Configurar Volume Docker (IMPORTANTE)

O `docker-compose.yml` JÁ está configurado com volume persistente:

```yaml
volumes:
  - ./public/uploads:/app/public/uploads
```

✅ **Isso garante que as imagens NÃO são perdidas** ao recriar o container.

### 4. Build e Inicialização

```bash
# Build da imagem
docker-compose build

# Iniciar serviço
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### 5. Configurar Backup Automático

No VPS, adicione ao crontab:

```bash
sudo crontab -e
```

Adicione:

```crontab
# Backup de imagens diariamente às 2h
0 2 * * * cd /opt/rpg-manager && ./scripts/backup.sh >> /var/log/rpg-backup.log 2>&1

# Health check a cada 15 minutos
*/15 * * * * cd /opt/rpg-manager && ./scripts/healthcheck.sh >> /var/log/rpg-health.log 2>&1
```

### 6. Backup do Firestore (Separo)

No **Firebase Console**:
1. Acesse → Firestore Database
2. Clique em "Export/Import"
3. Configure exportação agendada para um bucket GCS
4. Ou use a CLI para backup manual:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Exportar
firebase database:get / --token "SEU_TOKEN" > /opt/rpg-manager/backups/firestore_$(date +%Y%m%d).json
```

### 7. Testar Restauração

Antes de precisar, teste se o restore funciona:

```bash
cd /opt/rpg-manager
./scripts/restore.sh
```

Deve:
- Parar o container
- Fazer backup de segurança do atual
- Restaurar imagens
- Reiniciar container

### 8. Monitoramento

#### Verificar status:
```bash
cd /opt/rpg-manager
./scripts/healthcheck.sh
```

#### Logs:
```bash
# Aplicação
docker-compose logs -f slsw

# Backups
tail -f /var/log/rpg-backup.log

# Health
tail -f /var/log/rpg-health.log
```

#### Ver espaço em disco:
```bash
df -h
du -sh public/uploads/
```

## 🔒 Segurança

### NÃO FAÇA:
```bash
docker-compose down -v     # ❌ APAGA volumes
docker-compose rm -v       # ❌ APAGA volumes
docker volume prune        # ❌ APAGA todos os volumes
rm -rf public/uploads      # ❌ APAGA todas as imagens
```

### FAÇA:
```bash
docker-compose down        # ✅ Para container, volume preservado
docker-compose up -d       # ✅ Recria, volume mantido
./scripts/backup.sh        # ✅ Backup regular
```

## 🆘 Emergências

### 1. Docker quebrou, mas tenho backup das imagens:
```bash
cd /opt/rpg-manager
docker-compose down
./scripts/restore.sh
```

### 2. Perdi imagens mas tenho backup:
```bash
cd /opt/rpg-manager
# Restaurar manualmente
tar -xzf backups/backup_20260403_020000-uploads.tar.gz -C .
docker-compose restart
```

### 3. Preciso migrar para outro servidor:
```bash
# No servidor antigo
cd /opt/rpg-manager
./scripts/backup.sh
# Copiar backups/ para servidor novo

# No servidor novo
# 1. Clone o código
# 2. Copie o último backup
# 3. ./scripts/restore.sh
# 4. Restaure Firestore do backup JSON
```

## 📊 Volumes Docker Presentes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume de uploads
docker volume inspect rpg-manager_uploads  # se usar volume nomeado
# OU (com bind mount当前目录)
ls -la public/uploads/
```

## 🔄 Atualizações Seguras

Para atualizar a aplicação sem perder dados:

```bash
cd /opt/rpg-manager
git pull
./scripts/backup.sh  # backup pré-atualização
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

O volume `./public/uploads` **não é afetado** pelos comandos Docker.

## 🧪 Testes de Integridade

Após deploy, verificar:

1. ✅ Aplicação responde em http://seu-ip:5002
2. ✅ Upload de imagem funciona (criar personagem com foto)
3. ✅ Imagem persiste após `docker-compose restart`
4. ✅ Backup foi criado em `backups/`
5. ✅ Health check reporta tudo OK

---

## 📞 Suporte

Problemas comuns:

| Problema | Solução |
|----------|---------|
| Imagens somem após restart | Verifique se o volume Docker está configurado (`docker-compose.yml:29`) |
| backup.sh falha | Verifique permissões: `chmod +x scripts/backup.sh` |
| Restore lento | Arquivos grandes podem demorar, é normal |
| Porto 5002 em uso | Altere em `docker-compose.yml:15` |

**Última atualização**: 2026-04-03
