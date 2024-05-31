import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js';

const router = Router();
const ID_USUARIO_FIJO = 1;

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoServicio:
 *       type: object
 *       required:
 *         - nombre_servicio
 *         - descripcion
 *       properties:
 *         id_tipo_servicio:
 *           type: integer
 *           description: Identificador único del tipo de servicio
 *         nombre_servicio:
 *           type: string
 *           description: Nombre del tipo de servicio
 *         descripcion:
 *           type: string
 *           description: Descripción del tipo de servicio
 *       example:
 *         id_tipo_servicio: 1
 *         nombre_servicio: "Limpieza"
 *         descripcion: "Servicio de limpieza semanal"
 */

/**
 * @swagger
 * /api/typeServices:
 *   get:
 *     summary: Lista todos los tipos de servicio
 *     responses:
 *       200:
 *         description: Lista de tipos de servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoServicio'
 */
router.get('/typeServices', async (req, res) => {
    try {
        const tservicio = await prisma.tipoServicio.findMany();
        res.json({ status: true, data: tservicio });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service types' });
    }
});

/**
 * @swagger
 * /api/typeService/{id}:
 *   get:
 *     summary: Obtiene un tipo de servicio por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de servicio
 *     responses:
 *       200:
 *         description: Tipo de servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoServicio'
 *       404:
 *         description: Tipo de servicio no encontrado
 */
router.get('/typeService/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tservicio = await prisma.tipoServicio.findUnique({
            where: { id_tipo_servicio: parseInt(id) }
        });
        if (tservicio) {
            res.json({ status: true, data: tservicio });
        } else {
            res.status(404).json({ status: false, message: 'Service type not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service type' });
    }
});

/**
 * @swagger
 * /api/newTypeService:
 *   post:
 *     summary: Crea un nuevo tipo de servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoServicio'
 *     responses:
 *       201:
 *         description: Tipo de servicio creado
 *       500:
 *         description: Error creando el tipo de servicio
 */
router.post('/newTypeService', async (req, res) => {
    const { nombre_servicio, descripcion } = req.body;
    try {
        const newTServicio = await prisma.tipoServicio.create({
            data: {
                nombre_servicio,
                descripcion
            }
        });
        await registrarAuditoria('CREATE', 'TipoServicio', newTServicio.id_tipo_servicio, ID_USUARIO_FIJO);
        res.status(201).json({ status: true, message: 'Service type created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create service type' });
    }
});

/**
 * @swagger
 * /api/updateTypeService/{id}:
 *   put:
 *     summary: Actualiza un tipo de servicio existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoServicio'
 *     responses:
 *       200:
 *         description: Tipo de servicio actualizado
 *       500:
 *         description: Error actualizando el tipo de servicio
 */
router.put('/updateTypeService/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_servicio, descripcion } = req.body;
    try {
        const updatedTServicio = await prisma.tipoServicio.update({
            where: { id_tipo_servicio: parseInt(id) },
            data: {
                nombre_servicio,
                descripcion
            }
        });

        await registrarAuditoria('UPDATE', 'TipoServicio', updatedTServicio.id_tipo_servicio, ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'Service type updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update service type' });
    }
});

/**
 * @swagger
 * /api/deleteTypeService/{id}:
 *   delete:
 *     summary: Elimina un tipo de servicio existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de servicio
 *     responses:
 *       200:
 *         description: Tipo de servicio eliminado
 *       500:
 *         description: Error eliminando el tipo de servicio
 */
router.delete('/deleteTypeService/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar registros relacionados en PagoServicio
        await prisma.pagoServicio.deleteMany({
            where: { id_tipo_servicio: parseInt(id) }
        });

        // Luego eliminar el tipo de servicio
        await prisma.tipoServicio.delete({
            where: { id_tipo_servicio: parseInt(id) }
        });

        await registrarAuditoria('DELETE', 'TipoServicio', parseInt(id), ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'Service type deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Failed to delete service type' });
    }
});


export default router;
