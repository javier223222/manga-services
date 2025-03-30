# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Comando para ejecutar Prisma cuando el contenedor arranca
CMD npx prisma generate && npx prisma migrate deploy && node dist/main.js

EXPOSE 3000

