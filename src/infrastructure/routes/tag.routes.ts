import { Router } from 'express';
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
} from '../controllers/tag.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Gestión de etiquetas (tags)
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtener todas las etiquetas
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 */
router.get('/', getAllTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtener una etiqueta por ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.get('/:id', getTagById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crear una nueva etiqueta
 *     tags: [Tags]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etiqueta creada
 */
router.post('/', createTag);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualizar una etiqueta
 *     tags: [Tags]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 */
router.put('/:id', authMiddleware, updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Eliminar una etiqueta
 *     tags: [Tags]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Etiqueta eliminada
 */
router.delete('/:id', authMiddleware, deleteTag);

export default router;
