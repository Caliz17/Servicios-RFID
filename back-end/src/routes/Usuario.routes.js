import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// List all users
router.get('/users', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.json({ status: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch users' });
    }
});

// Get a single user by id
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario: parseInt(id) }
        });
        if (usuario) {
            res.json({ status: true, data: usuario });
        } else {
            res.status(404).json({ status: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch user' });
    }
});

// Create a new user
router.post('/newUser', async (req, res) => {
    const { nombre_usuario, contrasena, id_rol_usuario } = req.body;
    try {
        const newUser = await prisma.usuario.create({
            data: {
                nombre_usuario,
                contrasena,
                id_rol_usuario
            }
        });
        res.status(201).json({ status: true, message: 'User created' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to create user' });
    }
});

// Update an existing user
router.put('/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, contrasena, id_rol_usuario } = req.body;
    try {
        const updatedUser = await prisma.usuario.update({
            where: { id_usuario: parseInt(id) },
            data: {
                nombre_usuario,
                contrasena,
                id_rol_usuario
            }
        });
        res.json({ status: true, message: 'User updated' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to update user' });
    }
});

// Delete a user
router.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.usuario.delete({
            where: { id_usuario: parseInt(id) }
        });
        res.status(204).json({ status: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete user' });
    }
});

export default router;