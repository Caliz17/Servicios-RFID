import { Router } from "express";
import { prisma } from '../db.js';
import { registrarAuditoria } from '../Auditoria.js'; // Importa la función de auditoría

const router = Router();
// Definir el ID de usuario fijo
const ID_USUARIO_FIJO = 1;

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
 *     summary: Obtiene todos los roles de usuario
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
        res.status(500).json({ status: false, message: 'Error al obtener los roles' });
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
 *         description: Rol de usuario creado exitosamente
 *       500:
 *         description: Error al crear el rol de usuario
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

        // Registra la auditoría
        await registrarAuditoria('CREATE', 'rolUsuario', newRole.id_rol_usuario, ID_USUARIO_FIJO);

        res.status(201).json({ status: true, message: 'Rol creado correctamente' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al crear el rol' });
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
 *         description: Rol de usuario actualizado exitosamente
 *       500:
 *         description: Error al actualizar el rol de usuario
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

        // Registra la auditoría
        await registrarAuditoria('UPDATE', 'rolUsuario', parseInt(id), ID_USUARIO_FIJO);

        res.json({ status: true, message: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al actualizar el rol' });
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
 *         description: Rol de usuario eliminado exitosamente
 *       500:
 *         description: Error al eliminar el rol de usuario
 */
router.delete('/deleteRole/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.rolUsuario.delete({
            where: { id_rol_usuario: parseInt(id) }
        });

        // Registra la auditoría
        await registrarAuditoria('DELETE', 'rolUsuario', parseInt(id), ID_USUARIO_FIJO);

        res.json({ status: true, message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al eliminar el rol' });
    }
});

export default router;
