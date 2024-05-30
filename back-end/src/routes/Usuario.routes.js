import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre_usuario
 *         - contrasena
 *         - id_rol_usuario
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: Identificador único del usuario
 *         nombre_usuario:
 *           type: string
 *           description: Nombre del usuario
 *         contrasena:
 *           type: string
 *           description: Contraseña del usuario
 *         id_rol_usuario:
 *           type: integer
 *           description: ID del rol del usuario
 *       example:
 *         id_usuario: 1
 *         nombre_usuario: usuario1
 *         contrasena: password1
 *         id_rol_usuario: 1
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/users', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: {
                rolUsuario: { // Esto incluye los datos de la tabla RolUsuario
                    select: {
                        nombre_rol: true,
                    },
                },
            },
        });

        // Mapear los usuarios para reemplazar id_rol_usuario con nombre_rol
        const usuariosConRol = usuarios.map(usuario => ({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            contrasena: usuario.contrasena,
            nombre_rol: usuario.rolUsuario.nombre_rol,
        }));

        res.json({ status: true, data: usuariosConRol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch users' });
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /api/newUser:
 *   post:
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       500:
 *         description: Error creando el usuario
 */
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

/**
 * @swagger
 * /api/updateUser/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       500:
 *         description: Error actualizando el usuario
 */
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

/**
 * @swagger
 * /api/deleteUser/{id}:
 *   delete:
 *     summary: Elimina un usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       500:
 *         description: Error eliminando el usuario
 */
router.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.usuario.delete({
            where: { id_usuario: parseInt(id) }
        });
        res.status(200).json({ status: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete user' });
    }
});

export default router;
