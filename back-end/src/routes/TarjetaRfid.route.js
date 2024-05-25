import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all RFID cards
router.get('/cards', async (req, res) => {
    try {
        const tarjetas = await prisma.tarjetaRfid.findMany();
        res.json({ status: true, data: tarjetas });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch RFID cards' });
    }
});

// Get a single RFID card by id
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

// Create a new RFID card
router.post('/newCard', async (req, res) => {
    const { numero_tarjeta, id_cuenta, fecha_asignacion, estado } = req.body;
    try {
        const newTarjeta = await prisma.tarjetaRfid.create({
            data: {
                numero_tarjeta,
                id_cuenta,
                fecha_asignacion,
                estado
            }
        });
        res.status(201).json({ status: true, message: 'RFID card created'});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create RFID card' });
    }
});

// Update an existing RFID card
router.put('/updateCard/:id', async (req, res) => {
    const { id } = req.params;
    const { numero_tarjeta, id_cuenta, fecha_asignacion, estado } = req.body;
    try {
        const updatedTarjeta = await prisma.tarjetaRfid.update({
            where: { id_tarjeta: parseInt(id) },
            data: {
                numero_tarjeta,
                id_cuenta,
                fecha_asignacion,
                estado
            }
        });
        res.json({ status: true, message: 'RFID card updated'});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update RFID card' });
    }
});

// Down an RFID card
router.put('/downCard/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTarjeta = await prisma.tarjetaRfid.update({
            where: { id_tarjeta: parseInt(id) },
            data: {
                estado: 0
            }
        });
        res.status(200).json({ status: true, message: 'RFID card down success' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete RFID card' });
    }
});

export default router;