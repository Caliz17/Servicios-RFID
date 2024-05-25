import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all service payments
router.get('/pagos', async (req, res) => {
    try {
        const pagos = await prisma.pagoServicio.findMany();
        res.json({ status: true, data: pagos });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service payments' });
    }
});

// Get a single service payment by id
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

// Create a new service payment
router.post('/newPay', async (req, res) => {
    const { fecha_pago, monto_pago, id_cuenta, id_tipo_servicio } = req.body;
    try {
        const newPago = await prisma.pagoServicio.create({
            data: {
                fecha_pago,
                monto_pago,
                id_cuenta,
                id_tipo_servicio
            }
        });
        res.status(201).json({ status: true, message: 'Service payment created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create service payment' });
    }
});

// Update an existing service payment
router.put('/updatePay/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_pago, monto_pago, id_cuenta, id_tipo_servicio } = req.body;
    try {
        const updatedPago = await prisma.pagoServicio.update({
            where: { id_pago_servicio: parseInt(id) },
            data: {
                fecha_pago,
                monto_pago,
                id_cuenta,
                id_tipo_servicio
            }
        });
        res.json({ status: true, message: 'Service payment updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update service payment' });
    }
});

// Delete a service payment
router.delete('/deletePay/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.pagoServicio.delete({
            where: { id_pago_servicio: parseInt(id) }
        });
        res.status(204).json({ status: true, message: 'Service payment deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete service payment' });
    }
});

export default router;