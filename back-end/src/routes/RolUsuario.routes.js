import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await prisma.rolUsuario.findMany();
        res.json({ status: true, data: roles });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch roles' });
    }
});

// Get a single role by id
router.get('/rol/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const role = await prisma.rolUsuario.findUnique({
            where: { id_rol_usuario: parseInt(id) }
        });
        if (role) {
            res.json({ status: true, data: role });
        } else {
            res.status(404).json({ status: false, message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch role' });
    }
});

// Create a new role
router.post('/newRoles', async (req, res) => {
    const { nombre_rol, descripcion } = req.body;
    try {
        const newRole = await prisma.rolUsuario.create({
            data: {
                nombre_rol,
                descripcion
            }
        });
        res.status(201).json({ status: true, message: 'Role created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create role' });
    }
});

// Update an existing role
router.put('/updateRole/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
    try {
        const updatedRole = await prisma.rolUsuario.update({
            where: { id_rol_usuario: parseInt(id) },
            data: {
                nombre_rol,
                descripcion
            }
        });
        res.json({ status: true, message: 'Role updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update role' });
    }
});

// Delete a role
router.delete('/deleteRole/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.rolUsuario.delete({
            where: { id_rol_usuario: parseInt(id) }
        });
        res.status(202).json({ status: true, message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete role' });
    }
});

export default router;