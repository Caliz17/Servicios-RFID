import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all accounts
router.get('/cuentas', async (req, res) => {
    try {
        const cuentas = await prisma.cuenta.findMany();
        res.json({status: true, data: cuentas});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching accounts' });
    }
});

// Get a single account by id
router.get('/cuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cuenta = await prisma.cuenta.findUnique({
            where: { id_cuenta: parseInt(id) }
        });
        if (cuenta) {
            res.json({status: true, data: cuenta});
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching account' });
    }
});

// Create a new account
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
        res.status(201).json({status: true, success: 'Account created'});
    } catch (error) {
        res.status(500).json({status: false, error: 'Error creating account' });
    }
});

// Update an existing account
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
        res.json({status: true, success: 'Account updated'});
    } catch (error) {
        res.status(500).json({status: false, error: 'Error updating account' });
    }
});

// down an account
router.put('/downCuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const downAcount = await prisma.cuenta.update({
            where: { id_cuenta: parseInt(id) },
            data: {
                estado: 0
            }
        });
        res.status(202).json({status: true, success: 'Account down success' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
});

// up an account
router.put('/upCuenta/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const upAcount = await prisma.cuenta.update({
            where: { id_cuenta: parseInt(id) },
            data: {
                estado: 1
            }
        });
        res.status(202).json({status: true, success: 'Account up success' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account' });
    }
});

export default router;