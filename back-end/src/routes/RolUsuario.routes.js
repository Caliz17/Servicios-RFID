import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RolUsuario:
 *       type: object
 *       required:
 *         - nombre_rol
 *         - descripcion
 *       properties:
 *         id_rol_usuario:
 *           type: integer
 *           description: Identificador único del rol de usuario
 *         nombre_rol:
 *           type: string
 *           description: Nombre del rol
 *         descripcion:
 *           type: string
 *           description: Descripción del rol
 *       example:
 *         id_rol_usuario: 1
 *         nombre_rol: "Admin"
 *         descripcion: "Rol de administrador"
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Lista todos los roles de usuario
 *     responses:
 *       200:
 *         description: Lista de roles de usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolUsuario'
 */
router.get('/roles', async (req, res) => {
    try {
        const roles = await prisma.rolUsuario.findMany();
        res.json({ status: true, data: roles });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to fetch roles' });
    }
});

/**
 * @swagger
 * /api/rol/{id}:
 *   get:
 *     summary: Obtiene un rol de usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     responses:
 *       200:
 *         description: Rol de usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolUsuario'
 *       404:
 *         description: Rol de usuario no encontrado
 */
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

/**
 * @swagger
 * /api/newRoles:
 *   post:
 *     summary: Crea un nuevo rol de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolUsuario'
 *     responses:
 *       201:
 *         description: Rol de usuario creado
 *       500:
 *         description: Error creando el rol de usuario
 */
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

/**
 * @swagger
 * /api/updateRole/{id}:
 *   put:
 *     summary: Actualiza un rol de usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolUsuario'
 *     responses:
 *       200:
 *         description: Rol de usuario actualizado
 *       500:
 *         description: Error actualizando el rol de usuario
 */
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

/**
 * @swagger
 * /api/deleteRole/{id}:
 *   delete:
 *     summary: Elimina un rol de usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol de usuario
 *     responses:
 *       200:
 *         description: Rol de usuario eliminado
 *       500:
 *         description: Error eliminando el rol de usuario
 */
router.delete('/deleteRole/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.rolUsuario.delete({
            where: { id_rol_usuario: parseInt(id) }
        });
        res.json({ status: true, message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete role' });
    }
});

export default router;
