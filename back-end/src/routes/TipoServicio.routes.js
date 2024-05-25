import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all service types
router.get('/typeServices', async (req, res) => {
    try {
        const tservicio = await prisma.tipoServicio.findMany();
        res.json({ status: true, data: tservicio });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service types' });
    }
});

// Get a single service type by id
router.get('/typeService/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tservicio = await prisma.tipoServicio.findUnique({
            where: { id_tipo_servicio: parseInt(id) }
        });
        if (tservicio) {
            res.json({ status: true, data: tservicio });
        } else {
            res.status(404).json({ status: false, message: 'Service type not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch service type' });
    }
});

// Create a new service type
router.post('/newTypeService', async (req, res) => {
    const { nombre_servicio, descripcion } = req.body;
    try {
        const newTServicio = await prisma.tipoServicio.create({
            data: {
                nombre_servicio,
                descripcion
            }
        });
        res.status(201).json({ status: true, message: 'Service type created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create service type' });
    }
});

// Update an existing service type
router.put('/updateTypeService/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_servicio, descripcion } = req.body;
    try {
        const updatedTServicio = await prisma.tipoServicio.update({
            where: { id_tipo_servicio: parseInt(id) },
            data: {
                nombre_servicio,
                descripcion
            }
        });
        res.status(200).json({ status: true, message: 'Service type updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update service type' });
    }
});

// Delete a service type
router.delete('/deleteTypeService/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.tipoServicio.delete({
            where: { id_tipo_servicio: parseInt(id) }
        });
        res.status(200).json({ status: true, message: 'Service type deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete service type' });
    }
});

export default router;