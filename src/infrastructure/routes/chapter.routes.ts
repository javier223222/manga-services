import { Router } from 'express'; 
import {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
  grantChapterAccess,
  getChapterWithAccess
} from '../controllers/chapter.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Capítulos
 *   description: Operaciones sobre capítulos
 */

router.get('/', authMiddleware, getAllChapters);

/**
 * @swagger
 * /chapters:
 *   get:
 *     summary: Obtener todos los capítulos (paginado)
 *     tags: [Capítulos]
 *     security: [ { bearerAuth: [] } ]
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

router.get('/:id', authMiddleware, getChapterById);

/**
 * @swagger
 * /chapters/{id}:
 *   get:
 *     summary: Obtener un capítulo por ID (solo si es público o pagado)
 *     tags: [Capítulos]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Capítulo encontrado
 *       403:
 *         description: Acceso denegado
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
 *               public: { type: boolean }
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
 *               public:
 *                 type: boolean
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

/**
 * @swagger
 * /chapters/access/grant:
 *   post:
 *     summary: Otorgar acceso a un capítulo pagado
 *     tags: [Capítulos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, chapterId, paymentId]
 *             properties:
 *               userId: { type: string }
 *               chapterId: { type: string }
 *               paymentId: { type: string }
 *     responses:
 *       201: { description: Acceso otorgado }
 */
router.post('/access/grant', grantChapterAccess);

/**
 * @swagger
 * /chapters/access/{id}:
 *   get:
 *     summary: Obtener capítulo solo si el usuario tiene acceso o es público
 *     tags: [Capítulos]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Capítulo encontrado
 *       403:
 *         description: Acceso denegado
 */
router.get('/access/:id', authMiddleware, getChapterWithAccess);

export default router;
