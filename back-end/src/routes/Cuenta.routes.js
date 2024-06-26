import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js';

const router = Router();
const ID_USUARIO_FIJO = 1;
/**
 * @swagger
 * components:
 *   schemas:
 *     Cuenta:
 *       type: object
 *       required:
 *         - numero_cuenta
 *         - id_cliente
 *         - id_tipo_cuenta
 *         - saldo
 *       properties:
 *         id_cuenta:
 *           type: integer
 *           description: Identificador único de la cuenta
 *         numero_cuenta:
 *           type: string
 *           description: Número de la cuenta
 *         id_cliente:
 *           type: integer
 *           description: Identificador del cliente asociado
 *         id_tipo_cuenta:
 *           type: integer
 *           description: Identificador del tipo de cuenta
 *         saldo:
 *           type: number
 *           format: float
 *           description: Saldo de la cuenta
 *         estado:
 *           type: integer
 *           description: Estado de la cuenta (1 para activa, 0 para inactiva)
 *       example:
 *         id_cuenta: 1
 *         numero_cuenta: "123456789"
 *         id_cliente: 1
 *         id_tipo_cuenta: 1
 *         saldo: 1000.50
 *         estado: 1
 */

/**
 * @swagger
 * /api/cuentas:
 *   get:
 *     summary: Obtiene una lista de cuentas
 *     responses:
 *       200:
 *         description: Lista de cuentas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuenta'
 */
router.get('/cuentas', async (req, res) => {
    try {
        const cuentas = await prisma.cuenta.findMany({
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                tipoCuenta: {
                    select: {
                        nombre_tipo_cuenta: true
                    }
                }
            }
        });
        // Transformar los datos para que tengan el formato deseado
        const cuentasTransformadas = cuentas.map(cuenta => ({
            id_cuenta: cuenta.id_cuenta,
            numero_cuenta: cuenta.numero_cuenta,
            nombre_cliente: `${cuenta.cliente.nombre} ${cuenta.cliente.apellido}`,
            nombre_tipo_cuenta: cuenta.tipoCuenta.nombre_tipo_cuenta,
            saldo: cuenta.saldo,
            estado: cuenta.estado
        }));
        res.json({ status: true, data: cuentasTransformadas });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Error fetching accounts' });
    }
});


/**
 * @swagger
 * /api/cuenta/{id}:
 *   get:
 *     summary: Obtiene una cuenta por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Cuenta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuenta'
 *       404:
 *         description: Cuenta no encontrada
 */
router.get('/cuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cuenta = await prisma.cuenta.findUnique({
            where: { id_cuenta: parseInt(id) }
        });
        if (cuenta) {
            res.json({ status: true, data: cuenta });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching account' });
    }
});

/**
 * @swagger
 * /api/newCuenta:
 *   post:
 *     summary: Crea una nueva cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *     responses:
 *       201:
 *         description: Cuenta creada
 *       500:
 *         description: Error creando la cuenta
 */
router.post('/newCuenta', async (req, res) => {
    const { numero_cuenta, id_cliente, id_tipo_cuenta, saldo, estado } = req.body;
    try {
        const newCuenta = await prisma.cuenta.create({
            data: {
                numero_cuenta,
                id_cliente,
                id_tipo_cuenta,
                saldo,
                estado: estado !== undefined ? estado : 1 // Default to 1 if not provided
            }
        });
        await registrarAuditoria('CREATE', 'Cuenta', newCuenta.id_cuenta, ID_USUARIO_FIJO);
        res.status(201).json({ status: true, success: 'Account created' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error creating account' });
    }
});

/**
 * @swagger
 * /api/updateCuenta/{id}:
 *   put:
 *     summary: Actualiza una cuenta existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuenta'
 *     responses:
 *       200:
 *         description: Cuenta actualizada
 *       500:
 *         description: Error actualizando la cuenta
 */
router.put('/updateCuenta/:id', async (req, res) => {
    const { id } = req.params;
    const { numero_cuenta, id_cliente, id_tipo_cuenta, saldo, estado } = req.body;
    try {
        const updatedCuenta = await prisma.cuenta.update({
            where: { id_cuenta: parseInt(id) },
            data: {
                numero_cuenta,
                id_cliente,
                id_tipo_cuenta,
                saldo,
                estado
            }
        });

        await registrarAuditoria('UPDATE', 'Cuenta', updatedCuenta.id_cuenta, ID_USUARIO_FIJO);
        res.json({ status: true, success: 'Account updated' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error updating account' });
    }
});

/**
 * @swagger
 * /api/downCuenta/{id}:
 *   put:
 *     summary: Desactiva una cuenta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta
 *     responses:
 *       202:
 *         description: Cuenta desactivada
 *       500:
 *         description: Error desactivando la cuenta
 */
router.put('/downCuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const downAcount = await prisma.cuenta.update({
            where: { id_cuenta: parseInt(id) },
            data: {
                estado: 0
            }
        });

        await registrarAuditoria('UPDATE', 'Cuenta', downAcount.id_cuenta, ID_USUARIO_FIJO);
        res.status(202).json({ status: true, success: 'Account down success' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
});

/**
 * @swagger
 * /api/upCuenta/{id}:
 *   put:
 *     summary: Activa una cuenta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta
 *     responses:
 *       202:
 *         description: Cuenta activada
 *       500:
 *         description: Error activando la cuenta
 */
router.put('/upCuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const upAcount = await prisma.cuenta.update({
            where: { id_cuenta: parseInt(id) },
            data: {
                estado: 1
            }
        });

        await registrarAuditoria('CREATE', 'Cuenta', upAcount.id_cuenta, ID_USUARIO_FIJO);
        res.status(202).json({ status: true, success: 'Account up success' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
});

router.get('/cuentasActivas', async (req, res) => {
    try {
        const cuentas = await prisma.cuenta.findMany({
            where: {
                estado: 1
            },
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                tipoCuenta: {
                    select: {
                        nombre_tipo_cuenta: true
                    }
                }
            }
        });

        // Transformar los datos para que tengan el formato deseado
        const cuentasTransformadas = cuentas.map(cuenta => ({
            id_cuenta: cuenta.id_cuenta,
            numero_cuenta: cuenta.numero_cuenta,
            nombre_cliente: `${cuenta.cliente.nombre} ${cuenta.cliente.apellido}`,
            nombre_tipo_cuenta: cuenta.tipoCuenta.nombre_tipo_cuenta,
            saldo: cuenta.saldo,
            estado: cuenta.estado
        }));

        res.json({ status: true, data: cuentasTransformadas });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Error fetching accounts' });
    }
});



export default router;
