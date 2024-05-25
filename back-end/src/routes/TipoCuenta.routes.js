import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoCuenta:
 *       type: object
 *       required:
 *         - nombre_tipo_cuenta
 *         - descripcion
 *       properties:
 *         id_tipo_cuenta:
 *           type: integer
 *           description: Identificador único del tipo de cuenta
 *         nombre_tipo_cuenta:
 *           type: string
 *           description: Nombre del tipo de cuenta
 *         descripcion:
 *           type: string
 *           description: Descripción del tipo de cuenta
 *       example:
 *         id_tipo_cuenta: 1
 *         nombre_tipo_cuenta: "Cuenta de Ahorros"
 *         descripcion: "Cuenta de ahorros para clientes regulares"
 */

/**
 * @swagger
 * /api/accountTypes:
 *   get:
 *     summary: Lista todos los tipos de cuenta
 *     responses:
 *       200:
 *         description: Lista de tipos de cuenta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoCuenta'
 */
router.get('/accountTypes', async (req, res) => {
    try {
        const tcuentas = await prisma.tipoCuenta.findMany();
        res.json({ status: true, data: tcuentas });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch account types' });
    }
});

/**
 * @swagger
 * /api/accountType/{id}:
 *   get:
 *     summary: Obtiene un tipo de cuenta por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de cuenta
 *     responses:
 *       200:
 *         description: Tipo de cuenta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoCuenta'
 *       404:
 *         description: Tipo de cuenta no encontrado
 */
router.get('/accountType/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tcuenta = await prisma.tipoCuenta.findUnique({
            where: { id_tipo_cuenta: parseInt(id) }
        });
        if (tcuenta) {
            res.json({ status: true, data: tcuenta });
        } else {
            res.status(404).json({ status: false, message: 'Account type not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch account type' });
    }
});

/**
 * @swagger
 * /api/newAccountType:
 *   post:
 *     summary: Crea un nuevo tipo de cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoCuenta'
 *     responses:
 *       201:
 *         description: Tipo de cuenta creado
 *       500:
 *         description: Error creando el tipo de cuenta
 */
router.post('/newAccountType', async (req, res) => {
    const { nombre_tipo_cuenta, descripcion } = req.body;
    try {
        const newTCuenta = await prisma.tipoCuenta.create({
            data: {
                nombre_tipo_cuenta,
                descripcion
            }
        });
        res.status(201).json({ status: true, message: 'Account type created'});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create account type' });
    }
});

/**
 * @swagger
 * /api/updateAccountType/{id}:
 *   put:
 *     summary: Actualiza un tipo de cuenta existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoCuenta'
 *     responses:
 *       200:
 *         description: Tipo de cuenta actualizado
 *       500:
 *         description: Error actualizando el tipo de cuenta
 */
router.put('/updateAccountType/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_tipo_cuenta, descripcion } = req.body;
    try {
        const updatedTCuenta = await prisma.tipoCuenta.update({
            where: { id_tipo_cuenta: parseInt(id) },
            data: {
                nombre_tipo_cuenta,
                descripcion
            }
        });
        res.json({ status: true, message: 'Account type updated'});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update account type' });
    }
});

/**
 * @swagger
 * /api/deleteAccountType/{id}:
 *   delete:
 *     summary: Elimina un tipo de cuenta existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de cuenta
 *     responses:
 *       204:
 *         description: Tipo de cuenta eliminado
 *       500:
 *         description: Error eliminando el tipo de cuenta
 */
router.delete('/deleteAccountType/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.tipoCuenta.delete({
            where: { id_tipo_cuenta: parseInt(id) }
        });
        res.status(204).json({ status: true, message: 'Account type deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete account type' });
    }
});

export default router;
