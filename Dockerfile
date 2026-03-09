# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copia o código e gera o build de produção
COPY . .
RUN npm run build

# Estágio 2: Runner (Imagem final leve)
FROM node:20-alpine AS runner

WORKDIR /app

# Define ambiente como produção
ENV NODE_ENV=production

# Copia apenas os arquivos necessários do estágio de build
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Comando para iniciar em modo produção (sem Turbopack/HMR)
CMD ["npm", "run", "start"]