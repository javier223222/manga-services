import express from 'express';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infrastructure/swagger/swagger';
import chapterRoutes from './infrastructure/routes/chapter.routes';
import mangaRoutes from "./infrastructure/routes/manga.routes"
import tagRoutes from './infrastructure/routes/tag.routes';
import mangaTagRoutes from "./infrastructure/routes/mangaTag.routes"
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/chapters', chapterRoutes);
app.use("/api/mangas",mangaRoutes)
app.use('/api/tags', tagRoutes);
app.use('/api/manga-tags', mangaTagRoutes);


export default app;
