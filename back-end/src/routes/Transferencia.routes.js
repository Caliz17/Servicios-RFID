import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js';

const router = Router();
const ID_USUARIO_FIJO = 1;

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
    const { fecha_transferencia, monto_transferencia, cuenta_origen, cuenta_destino, id_usuario_autorizador } = req.body;

    if (!fecha_transferencia || !monto_transferencia || !cuenta_origen || !cuenta_destino || !id_usuario_autorizador) {
        return res.status(200).json({ status: false, message: 'Faltan campos obligatorios' });
    }

    // Verificar que la cuenta origen y la cuenta destino no sean la misma
    if (cuenta_origen === cuenta_destino) {
        return res.status(200).json({ status: false, message: 'No se puede transferir a la misma cuenta' });
    }

    const fechaTransferenciaISO = new Date(fecha_transferencia).toISOString();

    try {
        // Obtener los detalles de las cuentas origen y destino
        const cuentaOrigen = await prisma.cuenta.findUnique({ where: { id_cuenta: cuenta_origen } });
        const cuentaDestino = await prisma.cuenta.findUnique({ where: { id_cuenta: cuenta_destino } });

        if (!cuentaOrigen || !cuentaDestino) {
            return res.status(404).json({ status: false, message: 'Cuenta no encontrada' });
        }

        if (monto_transferencia <= 0) {
            return res.status(200).json({ status: false, message: 'El monto no puede ser negativo o 0' });
        }

        // Verificar si las cuentas están activas
        if (cuentaOrigen.estado !== 1 || cuentaDestino.estado !== 1) {
            return res.status(200).json({ status: false, message: 'Una o ambas cuentas están inactivas' });
        }

        // Verificar si hay fondos suficientes en la cuenta origen
        if (cuentaOrigen.saldo < monto_transferencia) {
            return res.status(200).json({ status: false, message: 'Fondos insuficientes' });
        }

        // Iniciar una transacción
        const result = await prisma.$transaction(async (prisma) => {
            // Crear la transferencia
            const newTransferencia = await prisma.transferencia.create({
                data: {
                    fecha_transferencia: fechaTransferenciaISO,
                    monto_transferencia,
                    cuenta_origen,
                    cuenta_destino,
                    id_usuario_autorizador
                }
            });

            // Actualizar saldos de las cuentas
            await prisma.cuenta.update({
                where: { id_cuenta: cuenta_origen },
                data: { saldo: { decrement: monto_transferencia } }
            });

            await prisma.cuenta.update({
                where: { id_cuenta: cuenta_destino },
                data: { saldo: { increment: monto_transferencia } }
            });

            // Registrar auditoría
            await registrarAuditoria('CREATE', 'Transferencia', newTransferencia.id_transferencia, id_usuario_autorizador);

            return newTransferencia;
        });

        res.status(201).json({ status: true, message: 'Transferencia creada' });
    } catch (error) {
        console.error('Error al crear la transferencia:', error);
        res.status(500).json({ status: false, message: 'Error al crear la transferencia', error: error.message });
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
        // Parse fecha_transferencia to ISO-8601 format
        const parsedFechaTransferencia = new Date(fecha_transferencia).toISOString();

        const updatedTransferencia = await prisma.transferencia.update({
            where: { id_transferencia: parseInt(id) },
            data: {
                fecha_transferencia: parsedFechaTransferencia,
                monto_transferencia,
                cuenta_origen,
                cuenta_destino,
                id_usuario_autorizador
            }
        });
        await registrarAuditoria('UPDATE', 'Transferencia', updatedTransferencia.id_transferencia, ID_USUARIO_FIJO);
        res.json({ status: true, message: 'Transfer updated' });
    } catch (error) {
        console.log('Error updating transfer:', error);
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
        await registrarAuditoria('DELETE', 'Transferencia', parseInt(id), ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'Transfer deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete transfer' });
    }
});

export default router;
