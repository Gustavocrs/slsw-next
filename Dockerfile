# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalamos as dependências
RUN npm install
COPY . .

# Desativamos a telemetria para acelerar o build
ENV NEXT_TELEMETRY_DISABLED 1

# O build agora passará pois a rota foi marcada como dinâmica
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p uploads public/uploads

EXPOSE 3000
CMD ["npm", "start"]