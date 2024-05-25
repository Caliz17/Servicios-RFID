import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all transfers
router.get('/transfers', async (req, res) => {
    try {
        const transferencias = await prisma.transferencia.findMany();
        res.json({ status: true, data: transferencias });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch transfers' });
    }
});

// Get a single transfer by id
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

// Create a new transfer
router.post('/newTransfer', async (req, res) => {
    const { fecha_transferencia, monto_transferencia, cuenta_origen, cuenta_destino, id_usuario_autorizador } = req.body;
    try {
        const newTransferencia = await prisma.transferencia.create({
            data: {
                fecha_transferencia,
                monto_transferencia,
                cuenta_origen,
                cuenta_destino,
                id_usuario_autorizador
            }
        });
        res.status(201).json({ status: true, message: 'Transfer created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create transfer' });
    }
});

// Update an existing transfer
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

// Delete a transfer
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