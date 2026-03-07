# syntax=docker/dockerfile:1

# Estágio de Build - Atualizado para Node 20
FROM node:20-alpine AS builder
WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Cópia do código e geração do build (Front + Back)
COPY . .
RUN npm run build

# Estágio de Execução (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia apenas os artefatos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Criação da pasta de uploads para evitar erro de permissão no volume
RUN mkdir -p uploads

EXPOSE 3000
CMD ["npm", "start"]