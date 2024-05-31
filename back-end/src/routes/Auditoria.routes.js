import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Auditoria:
 *       type: object
 *       required:
 *         - fecha_hora
 *         - accion
 *         - tabla_afectada
 *         - id_registro_afectado
 *         - id_usuario
 *       properties:
 *         id_auditoria:
 *           type: integer
 *           description: Identificador único de la auditoria
 *         fecha_hora:
 *           type: string
 *           description: Fecha y hora de la auditoria
 *         accion:
 *           type: string
 *           description: Acción realizada
 *         tabla_afectada:
 *           type: string
 *           description: Nombre de la tabla afectada
 *         id_registro_afectado:
 *           type: integer
 *           description: Identificador del registro afectado
 *         id_usuario:
 *           type: integer
 *           description: Identificador del usuario que realizó la acción
 *       example:
 *         id_auditoria: 1
 *         fecha_hora: "2021-09-01T12:00:00Z"
 *         accion: "CREATE"
 *         tabla_afectada: "clientes"
 *         id_registro_afectado: 1
 *         id_usuario: 1
 */

/**
 * @swagger
 * /api/auditorias:
 *   get:
 *     summary: Obtiene una lista de auditorías
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditoria'
 */
router.get('/auditorias', async (req, res) => {
    try {
        const auditorias = await prisma.auditoria.findMany();
        res.json({data: auditorias});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching auditorias' });
    }
});


export default router;
