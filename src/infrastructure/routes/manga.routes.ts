import { Router } from 'express';
import {
  createManga,
  getAllMangas,
  getMangaById,
  updateManga,
  deleteManga,
  getMangasByAuthor,
} from '../controllers/manga.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mangas
 *   description: Operaciones sobre mangas
 */

router.get('/', getAllMangas);

/**
 * @swagger
 * /mangas:
 *   get:
 *     summary: Obtener todos los mangas (paginado)
 *     tags: [Mangas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista paginada de mangas
 */

router.get('/author/:authorId', getMangasByAuthor);

/**
 * @swagger
 * /mangas/author/{authorId}:
 *   get:
 *     summary: Obtener mangas por autor (paginado)
 *     tags: [Mangas]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista paginada de mangas del autor
 */

router.get('/:id', getMangaById);

/**
 * @swagger
 * /mangas/{id}:
 *   get:
 *     summary: Obtener un manga por ID
 *     tags: [Mangas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Manga encontrado
 */

router.post('/', createManga);

/**
 * @swagger
 * /mangas:
 *   post:
 *     summary: Crear un manga con portada
 *     tags: [Mangas]
 *     security: [ { bearerAuth: [] } ]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, authorId, genre, cover]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               authorId: { type: string }
 *               genre: { type: string }
 *               cover: { type: string, format: binary }
 *     responses:
 *       201: { description: Manga creado }
 */

router.put('/:id', updateManga);
/**
 * @swagger
 * /mangas/{id}:
 *   put:
 *     summary: Actualizar un manga
 *     tags: [Mangas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Manga actualizado exitosamente
 *       404:
 *         description: Manga no encontrado
 */
router.delete('/:id',  deleteManga);
/**
 * @swagger
 * /mangas/{id}:
 *   delete:
 *     summary: Eliminar un manga por ID
 *     tags: [Mangas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Manga eliminado exitosamente
 *       404:
 *         description: Manga no encontrado
 */

export default router;