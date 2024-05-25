import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all auditorias
router.get('/auditorias', async (req, res) => {
    try {
        const auditorias = await prisma.auditoria.findMany();
        res.json(auditorias);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching auditorias' });
    }
});

// Get a single auditoria by id
router.get('/auditoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const auditoria = await prisma.auditoria.findUnique({
            where: { id_auditoria: parseInt(id) }
        });
        if (auditoria) {
            res.json({status:true, data: auditoria})
        } else {
            res.status(404).json({ status: false, error: 'Auditoria not found' });
        }
    } catch (error) {
        res.status(500).json({ status:false, error: 'Error fetching auditoria' });
    }
});

// Create a new auditoria
router.post('/newAuditorias', async (req, res) => {
    const { fecha_hora, accion, tabla_afectada, id_registro_afectado, id_usuario } = req.body;
    try {
        const newAuditoria = await prisma.auditoria.create({
            data: {
                fecha_hora,
                accion,
                tabla_afectada,
                id_registro_afectado,
                id_usuario
            }
        });
        res.status(201).json({status: true, success: 'Auditoria created' });
    } catch (error) {
        res.status(500).json({status:false, error: 'Error creating auditoria' });
    }
});

// Update an existing auditoria
router.put('/updateAuditorias/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_hora, accion, tabla_afectada, id_registro_afectado, id_usuario } = req.body;
    try {
        const updatedAuditoria = await prisma.auditoria.update({
            where: { id_auditoria: parseInt(id) },
            data: {
                fecha_hora,
                accion,
                tabla_afectada,
                id_registro_afectado,
                id_usuario
            }
        });
        res.status(200).json({ status: true, success: 'Auditoria updated' });
    } catch (error) {
        res.status(500).json({status: false, error: 'Error updating auditoria' });
    }
});

// Delete an auditoria
router.delete('/deleteAuditorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.auditoria.delete({
            where: { id_auditoria: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting auditoria' });
    }
});

export default router;
