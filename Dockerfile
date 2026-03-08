# Base image para ambiente de desenvolvimento
FROM node:20-slim

WORKDIR /app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package*.json ./
RUN npm install

# O restante do código é montado via volume no compose para dev,
# mas o COPY garante que o build funcione de forma isolada se necessário.
COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]