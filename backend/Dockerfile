FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

COPY . .

# Comando de inicio
CMD ["pnpm", "run", "start:dev"]