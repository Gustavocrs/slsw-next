# ESTÁGIO 1: Dependências
FROM node:22-slim AS dependencies
WORKDIR /app
COPY package*.json ./
# Instalamos TUDO (incluindo devDeps) para que o builder consiga compilar o CSS
RUN npm install

# ESTÁGIO 2: Builder
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

ENV NEXT_TELEMETRY_DISABLED 1

# Copiamos as node_modules completas
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# O build do Next.js agora terá o Tailwind/PostCSS disponível
RUN npm run build

# ESTÁGIO 3: Runner
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