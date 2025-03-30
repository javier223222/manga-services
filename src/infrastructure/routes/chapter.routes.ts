import { Router } from 'express';
import {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from '../controllers/chapter.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Capítulos
 *   description: Operaciones sobre capítulos
 */

router.get('/', getAllChapters);

/**
 * @swagger
 * /chapters:
 *   get:
 *     summary: Obtener todos los capítulos (paginado)
 *     tags: [Capítulos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista paginada de capítulos
 */

router.get('/:id', getChapterById);

/**
 * @swagger
 * /chapters/{id}:
 *   get:
 *     summary: Obtener un capítulo por ID
 *     tags: [Capítulos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Capítulo encontrado
 */

router.post('/', authMiddleware, createChapter);

/**
 * @swagger
 * /chapters:
 *   post:
 *     summary: Crear capítulo con PDF
 *     tags: [Capítulos]
 *     security: [ { bearerAuth: [] } ]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [mangaId, number, title, releaseDate, pdf]
 *             properties:
 *               mangaId: { type: string }
 *               number: { type: integer }
 *               title: { type: string }
 *               releaseDate: { type: string, format: date }
 *               pdf: { type: string, format: binary }
 *     responses:
 *       201: { description: Capítulo creado }
 */

router.put('/:id', authMiddleware, updateChapter);
/**
 * @swagger
 * /chapters/{id}:
 *   put:
 *     summary: Actualizar un capítulo
 *     tags: [Capítulos]
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
 *               number:
 *                 type: integer
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Capítulo actualizado exitosamente
 *       404:
 *         description: Capítulo no encontrado
 */
router.delete('/:id', authMiddleware, deleteChapter);
/**
 * @swagger
 * /chapters/{id}:
 *   delete:
 *     summary: Eliminar un capítulo por ID
 *     tags: [Capítulos]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Capítulo eliminado exitosamente
 *       404:
 *         description: Capítulo no encontrado
 */

export default router;
