FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

COPY . .

# Exponer host para Vite
CMD ["pnpm", "run", "dev", "--", "--host"]