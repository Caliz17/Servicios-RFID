import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transferencia:
 *       type: object
 *       required:
 *         - fecha_transferencia
 *         - monto_transferencia
 *         - cuenta_origen
 *         - cuenta_destino
 *         - id_usuario_autorizador
 *       properties:
 *         id_transferencia:
 *           type: integer
 *           description: Identificador único de la transferencia
 *         fecha_transferencia:
 *           type: string
 *           format: date
 *           description: Fecha de la transferencia
 *         monto_transferencia:
 *           type: number
 *           description: Monto de la transferencia
 *         cuenta_origen:
 *           type: integer
 *           description: ID de la cuenta origen
 *         cuenta_destino:
 *           type: integer
 *           description: ID de la cuenta destino
 *         id_usuario_autorizador:
 *           type: integer
 *           description: ID del usuario autorizador de la transferencia
 *       example:
 *         id_transferencia: 1
 *         fecha_transferencia: "2024-05-28"
 *         monto_transferencia: 100
 *         cuenta_origen: 1
 *         cuenta_destino: 2
 *         id_usuario_autorizador: 1
 */

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Lista todas las transferencias
 *     responses:
 *       200:
 *         description: Lista de transferencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transferencia'
 */
router.get('/transfers', async (req, res) => {
    try {
        const transferencias = await prisma.transferencia.findMany({
            include: {
                cuentaOrigen: {
                    include: {
                        cliente: {
                            select: {
                                id_cliente: true, // Incluir el ID del cliente
                                nombre: true // Nombre del cliente
                            }
                        }
                    }
                },
                cuentaDestino: {
                    include: {
                        cliente: {
                            select: {
                                id_cliente: true, // Incluir el ID del cliente
                                nombre: true // Nombre del cliente
                            }
                        }
                    }
                },
                usuarioAutorizador: {
                    select: {
                        id_usuario: true, // Incluir el ID del usuario autorizador
                        nombre_usuario: true // Nombre del usuario autorizador
                    }
                }
            }
        });

        const transferenciasConNombres = transferencias.map(transferencia => ({
            id_transferencia: transferencia.id_transferencia,
            fecha_transferencia: transferencia.fecha_transferencia,
            monto_transferencia: transferencia.monto_transferencia,
            cuenta_origen: {
                id_cuenta: transferencia.cuentaOrigen.id_cuenta, // ID de la cuenta de origen
                nombre_cliente: transferencia.cuentaOrigen.cliente.nombre // Nombre del cliente de la cuenta de origen
            },
            cuenta_destino: {
                id_cuenta: transferencia.cuentaDestino.id_cuenta, // ID de la cuenta de destino
                nombre_cliente: transferencia.cuentaDestino.cliente.nombre // Nombre del cliente de la cuenta de destino
            },
            usuario_autorizador: {
                id_usuario: transferencia.usuarioAutorizador.id_usuario, // ID del usuario autorizador
                nombre_usuario: transferencia.usuarioAutorizador.nombre_usuario // Nombre del usuario autorizador
            }
        }));

        res.json({ status: true, data: transferenciasConNombres });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch transfers', error: error.message });
    }
});


/**
 * @swagger
 * /api/transfer/{id}:
 *   get:
 *     summary: Obtiene una transferencia por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la transferencia
 *     responses:
 *       200:
 *         description: Transferencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transferencia'
 *       404:
 *         description: Transferencia no encontrada
 */
router.get('/transfer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transferencia = await prisma.transferencia.findUnique({
            where: { id_transferencia: parseInt(id) }
        });
        if (transferencia) {
            res.json({ status: true, data: transferencia });
        } else {
            res.status(404).json({ status: false, message: 'Transfer not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch transfer' });
    }
});

/**
 * @swagger
 * /api/newTransfer:
 *   post:
 *     summary: Crea una nueva transferencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transferencia'
 *     responses:
 *       201:
 *         description: Transferencia creada
 *       500:
 *         description: Error creando la transferencia
 */
router.post('/newTransfer', async (req, res) => {
    try {
        const { fecha_transferencia, monto_transferencia, cuenta_origen, cuenta_destino, id_usuario_autorizador } = req.body;
        
        if (!fecha_transferencia || !monto_transferencia || !cuenta_origen || !cuenta_destino || !id_usuario_autorizador) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        // Parsear la fecha en formato ISO-8601
        const fechaTransferenciaISO = new Date(fecha_transferencia).toISOString();

        const newTransferencia = await prisma.transferencia.create({
            data: {
                fecha_transferencia: fechaTransferenciaISO,
                monto_transferencia,
                cuenta_origen,
                cuenta_destino,
                id_usuario_autorizador
            }
        });

        res.status(201).json({ status: true, message: 'Transfer created' });
    } catch (error) {
        console.error('Error creating transfer:', error);
        res.status(500).json({ status: false, message: 'Failed to create transfer', error: error.message });
    }
});

/**
 * @swagger
 * /api/updateTransfer/{id}:
 *   put:
 *     summary: Actualiza una transferencia existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la transferencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transferencia'
 *     responses:
 *       200:
 *         description: Transferencia actualizada
 *       500:
 *         description: Error actualizando la transferencia
 */
router.put('/updateTransfer/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_transferencia, monto_transferencia, cuenta_origen, cuenta_destino, id_usuario_autorizador } = req.body;
    try {
        const updatedTransferencia = await prisma.transferencia.update({
            where: { id_transferencia: parseInt(id) },
            data: {
                fecha_transferencia,
                monto_transferencia,
                cuenta_origen,
                cuenta_destino,
                id_usuario_autorizador
            }
        });
        res.json({ status: true, message: 'Transfer updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update transfer' });
    }
});

/**
 * @swagger
 * /api/deleteTransfer/{id}:
 *   delete:
 *     summary: Elimina una transferencia existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la transferencia
 *     responses:
 *       200:
 *         description: Transferencia eliminada
 *       500:
 *         description: Error eliminando la transferencia
 */
router.delete('/deleteTransfer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.transferencia.delete({
            where: { id_transferencia: parseInt(id) }
        });
        res.status(200).json({ status: true, message: 'Transfer deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete transfer' });
    }
});

export default router;
