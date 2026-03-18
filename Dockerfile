# ESTÁGIO 1: Builder (Unificamos dependências e build para não duplicar arquivos)
FROM node:22-slim AS builder
WORKDIR /app

# ARGs do Firebase (Mantidos conforme seu original)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./

# Instala as dependências usando cache em memória/volume temporário para poupar o disco
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copia o restante do código
COPY . .

# Executa o build (o Tailwind/PostCSS estará disponível)
RUN npm run build

# ESTÁGIO 2: Runner
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# O modo standalone já otimiza o tamanho, não precisamos das devDeps aqui
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

# Execução via node server.js (saída do standalone)
CMD ["node", "server.js"]