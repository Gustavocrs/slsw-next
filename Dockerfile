FROM node:20-alphine

WORKDIR /app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copia o restante dos arquivos
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Expõe a porta interna
EXPOSE 3000

# Comando para iniciar em modo produção
CMD ["npm", "run", "start"]