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
        res.json(auditorias);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching auditorias' });
    }
});

/**
 * @swagger
 * /api/auditoria/{id}:
 *   get:
 *     summary: Obtiene una auditoría por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la auditoría
 *     responses:
 *       200:
 *         description: Auditoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *       404:
 *         description: Auditoría no encontrada
 */
router.get('/auditoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const auditoria = await prisma.auditoria.findUnique({
            where: { id_auditoria: parseInt(id) }
        });
        if (auditoria) {
            res.json({ status: true, data: auditoria });
        } else {
            res.status(404).json({ status: false, error: 'Auditoria not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error fetching auditoria' });
    }
});

/**
 * @swagger
 * /api/newAuditorias:
 *   post:
 *     summary: Crea una nueva auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auditoria'
 *     responses:
 *       201:
 *         description: Auditoría creada
 *       500:
 *         description: Error creando la auditoría
 */
router.post('/newAuditorias', async (req, res) => {
    const { fecha_hora, accion, tabla_afectada, id_registro_afectado, id_usuario } = req.body;
    try {
        const newAuditoria = await prisma.auditoria.create({
            data: {
                fecha_hora,
                accion,
                tabla_afectada,
                id_registro_afectado,
                id_usuario
            }
        });
        res.status(201).json({ status: true, success: 'Auditoria created' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error creating auditoria' });
    }
});

/**
 * @swagger
 * /api/updateAuditorias/{id}:
 *   put:
 *     summary: Actualiza una auditoría existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auditoria'
 *     responses:
 *       200:
 *         description: Auditoría actualizada
 *       500:
 *         description: Error actualizando la auditoría
 */
router.put('/updateAuditorias/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_hora, accion, tabla_afectada, id_registro_afectado, id_usuario } = req.body;
    try {
        const updatedAuditoria = await prisma.auditoria.update({
            where: { id_auditoria: parseInt(id) },
            data: {
                fecha_hora,
                accion,
                tabla_afectada,
                id_registro_afectado,
                id_usuario
            }
        });
        res.status(200).json({ status: true, success: 'Auditoria updated' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error updating auditoria' });
    }
});

/**
 * @swagger
 * /api/deleteAuditorias/{id}:
 *   delete:
 *     summary: Elimina una auditoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la auditoría
 *     responses:
 *       204:
 *         description: Auditoría eliminada
 *       500:
 *         description: Error eliminando la auditoría
 */
router.delete('/deleteAuditorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.auditoria.delete({
            where: { id_auditoria: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting auditoria' });
    }
});

export default router;
