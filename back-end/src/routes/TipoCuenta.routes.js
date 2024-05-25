import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all account types
router.get('/accountTypes', async (req, res) => {
    try {
        const tcuentas = await prisma.tipoCuenta.findMany();
        res.json({ status: true, message: 'Account types list'});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch account types' });
    }
});

// Get a single account type by id
router.get('/accountType/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tcuenta = await prisma.tipoCuenta.findUnique({
            where: { id_tipo_cuenta: parseInt(id) }
        });
        if (tcuenta) {
            res.json({ status: true, data: tcuenta});
        } else {
            res.status(404).json({ status: false, message: 'Account type not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch account type' });
    }
});

// Create a new account type
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

// Update an existing account type
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

// Delete an account type
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