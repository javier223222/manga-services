# 📚 Manga Microservice

Este es un microservicio construido en TypeScript usando Express, Prisma, JWT, Swagger y Docker para la gestión de mangas, capítulos y etiquetas.

---

## 🚀 Tecnologías usadas

- **Node.js + Express**
- **TypeScript**
- **Prisma + MySQL**
- **Swagger (OpenAPI)**
- **JWT Authentication**
- **Cloudinary (para imágenes/PDFs)**
- **Docker + Docker Compose**

---

## ⚙️ Instalación local

1. Clona el repositorio:

git clone https://github.com/tu-usuario/manga-service.git
cd manga-service


2. Instala dependecias 
npm i
3. crea un archivo .env 
DATABASE_URL="mysql://root:root@localhost:3306/mangas"
JWT_SECRET="supersecret"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
4. genera prisma 
npx prisma generate
npx prisma migrate dev --name init

5. Corre el servidor local
npm run dev

# Usar docker 🐳
1. Ejecuta 
docker-compose up --build
