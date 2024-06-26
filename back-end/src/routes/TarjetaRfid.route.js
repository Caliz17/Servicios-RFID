import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js';

const router = Router();
const ID_USUARIO_FIJO = 1;
/**
 * @swagger
 * components:
 *   schemas:
 *     TarjetaRfid:
 *       type: object
 *       required:
 *         - numero_tarjeta
 *         - id_cuenta
 *         - fecha_asignacion
 *         - estado
 *       properties:
 *         id_tarjeta:
 *           type: integer
 *           description: Identificador único de la tarjeta RFID
 *         numero_tarjeta:
 *           type: string
 *           description: Número de la tarjeta RFID
 *         id_cuenta:
 *           type: integer
 *           description: Identificador de la cuenta asociada a la tarjeta RFID
 *         fecha_asignacion:
 *           type: string
 *           description: Fecha de asignación de la tarjeta RFID
 *         estado:
 *           type: integer
 *           description: Estado de la tarjeta RFID (1 para activa, 0 para inactiva)
 *       example:
 *         id_tarjeta: 1
 *         numero_tarjeta: "RFID001"
 *         id_cuenta: 1
 *         fecha_asignacion: "2024-05-25"
 *         estado: 1
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Lista todas las tarjetas RFID
 *     responses:
 *       200:
 *         description: Lista de tarjetas RFID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TarjetaRfid'
 */
router.get('/cards', async (req, res) => {
    try {
        const tarjetas = await prisma.tarjetaRfid.findMany({
            include: {
                cuenta: {
                    select: {
                        numero_cuenta: true,
                        cliente: {
                            select: {
                                nombre: true,
                                apellido: true
                            }
                        }
                    }
                }
            }
        });
        res.json({ status: true, data: tarjetas });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch RFID cards' });
    }
});


/**
 * @swagger
 * /api/card/{id}:
 *   get:
 *     summary: Obtiene una tarjeta RFID por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarjeta RFID
 *     responses:
 *       200:
 *         description: Tarjeta RFID encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TarjetaRfid'
 *       404:
 *         description: Tarjeta RFID no encontrada
 */
router.get('/card/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tarjeta = await prisma.tarjetaRfid.findUnique({
            where: { id_tarjeta: parseInt(id) }
        });
        if (tarjeta) {
            res.json({ status: true, data: tarjeta });
        } else {
            res.status(404).json({ status: false, message: 'RFID card not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch RFID card' });
    }
});

/**
 * @swagger
 * /api/newCard:
 *   post:
 *     summary: Crea una nueva tarjeta RFID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarjetaRfid'
 *     responses:
 *       201:
 *         description: Tarjeta RFID creada
 *       500:
 *         description: Error creando la tarjeta RFID
 */
router.post('/newCard', async (req, res) => {
    const { numero_tarjeta, id_cuenta, fecha_asignacion, estado } = req.body;
    try {
        // Verificar si existe alguna tarjeta RFID asociada con el número de cuenta proporcionado
        const existingCard = await prisma.tarjetaRfid.findFirst({
            where: {
                numero_tarjeta: numero_tarjeta
            }
        });

        if (existingCard) {
            return res.status(200).json({ status: false, message: 'La tarjeta ya se encuentra registrada' });
        }

        // Formatear la fecha en formato ISO-8601
        const formattedFechaAsignacion = new Date(fecha_asignacion).toISOString();
        
        const newTarjeta = await prisma.tarjetaRfid.create({
            data: {
                numero_tarjeta,
                id_cuenta,
                fecha_asignacion: formattedFechaAsignacion, // Usar la fecha formateada
                estado
            }
        });
        await registrarAuditoria('CREATE', 'TarjetaRfid', newTarjeta.id_tarjeta, ID_USUARIO_FIJO);
        res.status(201).json({ status: true, message: 'RFID card created'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Failed to create RFID card' });
    }
});



/**
 * @swagger
 * /api/updateCard/{id}:
 *   put:
 *     summary: Actualiza una tarjeta RFID existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarjeta RFID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TarjetaRfid'
 *     responses:
 *       200:
 *         description: Tarjeta RFID actualizada
 *       500:
 *         description: Error actualizando la tarjeta RFID
 */
router.put('/updateCard/:id', async (req, res) => {
    const { id } = req.params;
    const { numero_tarjeta, id_cuenta, fecha_asignacion, estado } = req.body;

    // Validar y convertir fecha_asignacion a un objeto Date
    let parsedFechaAsignacion;
    try {
        parsedFechaAsignacion = new Date(fecha_asignacion);
        if (isNaN(parsedFechaAsignacion)) {
            throw new Error('Invalid date format');
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Invalid date format' });
    }

    try {
        const updatedTarjeta = await prisma.tarjetaRfid.update({
            where: { id_tarjeta: parseInt(id) },
            data: {
                numero_tarjeta,
                id_cuenta,
                fecha_asignacion: parsedFechaAsignacion,
                estado
            }
        });
        await registrarAuditoria('UPDATE', 'TarjetaRfid', updatedTarjeta.id_tarjeta, ID_USUARIO_FIJO);
        res.json({ status: true, message: 'RFID card updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to update RFID card' });
    }
});


/**
 * @swagger
 * /api/downCard/{id}:
 *   put:
 *     summary: Desactiva una tarjeta RFID existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarjeta RFID
 *     responses:
 *       200:
 *         description: Tarjeta RFID desactivada
 *       500:
 *         description: Error desactivando la tarjeta RFID
 */
router.put('/downCard/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTarjeta = await prisma.tarjetaRfid.update({
            where: { id_tarjeta: parseInt(id) },
            data: {
                estado: 0
            }
        });
        await registrarAuditoria('UPDATE', 'TarjetaRfid', updatedTarjeta.id_tarjeta, ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'RFID card down success' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete RFID card' });
    }
});

/**
 * @swagger
 * /api/upCard/{id}:
 *   put:
 *     summary: Activa una tarjeta RFID existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarjeta RFID
 *     responses:
 *       200:
 *         description: Tarjeta RFID activada
 *       500:
 *         description: Error activando la tarjeta RFID
 */
router.put('/upCard/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTarjeta = await prisma.tarjetaRfid.update({
            where: { id_tarjeta: parseInt(id) },
            data: {
                estado: 1
            }
        });
        await registrarAuditoria('UPDATE', 'TarjetaRfid', updatedTarjeta.id_tarjeta, ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'RFID card up success' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to activate RFID card' });
    }
});

export default router;