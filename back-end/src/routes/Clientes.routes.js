import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all clients
router.get('/clientes', async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.json({ status: true, data: clientes });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error fetching clients' });
    }
});

// Get a single client by id
router.get('/cliente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id_cliente: parseInt(id) }
        });
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ status: false, error: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error fetching client' });
    }
});

// Create a new client
router.post('/newClient', async (req, res) => {
    const { nombre, apellido, direccion, telefono, correo_electronico, contrasenia, perfil, estado } = req.body;
    try {
        const newCliente = await prisma.cliente.create({
            data: {
                nombre,
                apellido,
                direccion,
                telefono,
                correo_electronico,
                contrasenia,
                perfil,
                estado: estado !== undefined ? estado : 1 // Default to 1 if not provided
            }
        });
        res.status(201).json({ status: true, success: 'Client created' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error creating client' });
    }
});

// Update an existing client
router.put('/updateClientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, telefono, correo_electronico, contrasenia, perfil, estado } = req.body;
    try {
        const updatedCliente = await prisma.cliente.update({
            where: { id_cliente: parseInt(id) },
            data: {
                nombre,
                apellido,
                direccion,
                telefono,
                correo_electronico,
                contrasenia,
                perfil,
                estado
            }
        });
        res.json({ status: true, success: 'Client updated' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error updating client' });
    }
});

// down to client
router.put('/downClient/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const downCliente = await prisma.cliente.update({
            where: { id_cliente: parseInt(id) },
            data: {
                estado: 0
            }
        });
        res.status(201).json({ status: true, success: 'Client down success' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error deleting client' });
    }
});


router.put('/upClient/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const upCliente = await prisma.cliente.update({
            where: { id_cliente: parseInt(id) },
            data: {
                estado: 1
            }
        });
        res.status(201).json({ status: true, success: 'Client up success' });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error deleting client' });
    }
});

export default router;