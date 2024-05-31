import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js';
const router = Router();
const ID_USUARIO_FIJO = 1;
/**
 * @swagger
 * components:
 *   schemas:
 *     PagoServicio:
 *       type: object
 *       required:
 *         - fecha_pago
 *         - monto_pago
 *         - id_cuenta
 *         - id_tipo_servicio
 *       properties:
 *         id_pago_servicio:
 *           type: integer
 *           description: Identificador único del pago de servicio
 *         fecha_pago:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del pago
 *         monto_pago:
 *           type: number
 *           format: float
 *           description: Monto del pago
 *         id_cuenta:
 *           type: integer
 *           description: Identificador de la cuenta desde la cual se realizó el pago
 *         id_tipo_servicio:
 *           type: integer
 *           description: Identificador del tipo de servicio pagado
 *       example:
 *         id_pago_servicio: 1
 *         fecha_pago: "2023-05-01T12:00:00Z"
 *         monto_pago: 100.50
 *         id_cuenta: 1
 *         id_tipo_servicio: 1
 */

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Lista todos los pagos de servicios
 *     responses:
 *       200:
 *         description: Lista de pagos de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PagoServicio'
 */
router.get('/pagos', async (req, res) => {
    try {
        const pagos = await prisma.pagoServicio.findMany({
            include: {
                cuenta: {
                    select: {
                        numero_cuenta: true
                    }
                },
                tipoServicio:{
                    select: {
                        nombre_servicio: true
                    }
                }
            }
        });
        res.json({ status: true, data: pagos });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service payments' });
    }
});

/**
 * @swagger
 * /api/pago/{id}:
 *   get:
 *     summary: Obtiene un pago de servicio por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago de servicio
 *     responses:
 *       200:
 *         description: Pago de servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagoServicio'
 *       404:
 *         description: Pago de servicio no encontrado
 */
router.get('/pago/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pago = await prisma.pagoServicio.findUnique({
            where: { id_pago_servicio: parseInt(id) }
        });
        if (pago) {
            res.json({ status: true, data: pago });
        } else {
            res.status(404).json({ status: false, message: 'Service payment not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service payment' });
    }
});

/**
 * @swagger
 * /api/newPay:
 *   post:
 *     summary: Crea un nuevo pago de servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoServicio'
 *     responses:
 *       201:
 *         description: Pago de servicio creado
 *       500:
 *         description: Error creando el pago de servicio
 */
router.post('/newPay', async (req, res) => {
    const { fecha_pago, monto_pago, id_cuenta, id_tipo_servicio } = req.body;

    // Convertir fecha_pago a un objeto Date
    let parsedFechaPago;
    try {
        parsedFechaPago = new Date(fecha_pago);
        if (isNaN(parsedFechaPago)) {
            throw new Error('Invalid date format');
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Invalid date format' });
    }

    try {
        const newPago = await prisma.pagoServicio.create({
            data: {
                fecha_pago: parsedFechaPago,
                monto_pago: parseFloat(monto_pago), 
                id_cuenta: parseInt(id_cuenta), 
                id_tipo_servicio: parseInt(id_tipo_servicio)
            }
        });
        await registrarAuditoria('CREATE', 'PagoServicio', newPago.id_pago_servicio, ID_USUARIO_FIJO);
        res.status(201).json({ status: true, message: 'Service payment created' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ status: false, message: 'Failed to create service payment', error: error.message });
    }
});


/**
 * @swagger
 * /api/updatePay/{id}:
 *   put:
 *     summary: Actualiza un pago de servicio existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago de servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagoServicio'
 *     responses:
 *       200:
 *         description: Pago de servicio actualizado
 *       500:
 *         description: Error actualizando el pago de servicio
 */
router.put('/updatePay/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_pago, monto_pago, id_cuenta, id_tipo_servicio } = req.body;

    // Validar y convertir fecha_pago a un objeto Date
    let parsedFechaPago;
    try {
        parsedFechaPago = new Date(fecha_pago);
        if (isNaN(parsedFechaPago)) {
            throw new Error('Invalid date format');
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Invalid date format' });
    }

    // Validar y convertir monto_pago a un número
    let parsedMontoPago;
    try {
        parsedMontoPago = parseFloat(monto_pago);
        if (isNaN(parsedMontoPago)) {
            throw new Error('Invalid amount format');
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Invalid amount format' });
    }

    // Validar y convertir id_cuenta e id_tipo_servicio a números
    let parsedIdCuenta, parsedIdTipoServicio;
    try {
        parsedIdCuenta = parseInt(id_cuenta);
        parsedIdTipoServicio = parseInt(id_tipo_servicio);
        if (isNaN(parsedIdCuenta) || isNaN(parsedIdTipoServicio)) {
            throw new Error('Invalid ID format');
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Invalid ID format' });
    }

    try {
        const updatedPago = await prisma.pagoServicio.update({
            where: { id_pago_servicio: parseInt(id) },
            data: {
                fecha_pago: parsedFechaPago,
                monto_pago: parsedMontoPago,
                id_cuenta: parsedIdCuenta,
                id_tipo_servicio: parsedIdTipoServicio
            }
        });
        await registrarAuditoria('UPDATE', 'PagoServicio', updatedPago.id_pago_servicio, ID_USUARIO_FIJO);
        res.json({ status: true, message: 'Service payment updated' });
    } catch (error) {
        console.error(error); // Registrar el error en los logs
        res.status(500).json({ status: false, message: 'Failed to update service payment', error: error.message });
    }
});


/**
 * @swagger
 * /api/deletePay/{id}:
 *   delete:
 *     summary: Elimina un pago de servicio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago de servicio
 *     responses:
 *       204:
 *         description: Pago de servicio eliminado
 *       500:
 *         description: Error eliminando el pago de servicio
 */
router.delete('/deletePay/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.pagoServicio.delete({
            where: { id_pago_servicio: parseInt(id) }
        });
        await registrarAuditoria('DELETE', 'PagoServicio', id, ID_USUARIO_FIJO);
        res.status(204).json({ status: true, message: 'Service payment deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete service payment' });
    }
});

export default router;
