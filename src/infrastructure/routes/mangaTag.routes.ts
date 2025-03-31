import { Router } from 'express';
import { assignTagToManga, removeTagFromManga } from '../controllers/tag.controller';
import { getMangasByTag } from '../controllers/manga.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MangaTag
 *   description: Asignación de etiquetas a mangas
 */

/**
 * @swagger
 * /manga-tags/assign:
 *   post:
 *     summary: Asignar un tag a un manga
 *     tags: [MangaTag]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mangaId, tagId]
 *             properties:
 *               mangaId: { type: string }
 *               tagId: { type: string }
 *     responses:
 *       201:
 *         description: Tag asignado
 */
router.post('/assign', assignTagToManga);

/**
 * @swagger
 * /manga-tags/remove:
 *   delete:
 *     summary: Quitar un tag de un manga
 *     tags: [MangaTag]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mangaId, tagId]
 *             properties:
 *               mangaId: { type: string }
 *               tagId: { type: string }
 *     responses:
 *       200:
 *         description: Tag eliminado del manga
 */
router.delete('/remove', removeTagFromManga);

/**
 * @swagger
 * /manga-tags/by-tag/{tagId}:
 *   get:
 *     summary: Obtener mangas por tag con paginación
 *     tags: [MangaTag]
 *     parameters:
 *       - in: path
 *         name: tagId
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
 *         description: Lista paginada de mangas con ese tag
 */
router.get('/by-tag/:tagId', getMangasByTag);

export default router;
