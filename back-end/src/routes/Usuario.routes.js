import { Router } from "express";
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import { registrarAuditoria } from '../Auditoria.js';
import bcrypt from 'bcrypt';

const router = Router();
const ID_USUARIO_FIJO = 1;

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
 *       500:
 *         description: Error al obtener los usuarios
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

        // Mapear los usuarios para reemplazar id_rol_usuario con nombre_rol y omitir la contraseña
        const usuariosConRol = usuarios.map(usuario => ({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
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
 *       500:
 *         description: Error al obtener el usuario
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
        // Utilizando prisma.$queryRaw para cifrar la contraseña directamente en PostgreSQL
        const hashedPassword = await prisma.$queryRaw`SELECT crypt(${contrasena}, gen_salt('bf')) AS hashed_password`;

        const newUser = await prisma.usuario.create({
            data: {
                nombre_usuario,
                contrasena: hashedPassword[0].hashed_password,
                id_rol_usuario
            }
        });

        await registrarAuditoria('CREATE', 'Usuario', newUser.id_usuario, ID_USUARIO_FIJO);
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
        const hashedPassword = await prisma.$queryRaw`SELECT crypt(${contrasena}, gen_salt('bf')) AS hashed_password`;
        const updatedUser = await prisma.usuario.update({
            where: { id_usuario: parseInt(id) },
            data: {
                nombre_usuario,
                contrasena: hashedPassword[0].hashed_password,
                id_rol_usuario
            }
        });
        await registrarAuditoria('UPDATE', 'Usuario', updatedUser.id_usuario, ID_USUARIO_FIJO);
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
 *       200:
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
        await registrarAuditoria('DELETE', 'Usuario', parseInt(id), ID_USUARIO_FIJO);
        res.status(200).json({ status: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to delete user' });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión para usuarios y clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario o correo electrónico
 *               password:
 *                 type: string
 *                 description: Contraseña
 *             example:
 *               username: usuario1
 *               password: password1
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indica si el inicio de sesión fue exitoso o no
 *                 userType:
 *                   type: string
 *                   description: Tipo de usuario (usuario o cliente)
 *                 role:
 *                   type: string
 *                   description: Rol del usuario (solo para usuarios)
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *       400:
 *         description: Nombre de usuario o contraseña no proporcionados
 *       403:
 *         description: La cuenta del cliente está inactiva
 *       404:
 *         description: Nombre de usuario o contraseña inválidos
 *       500:
 *         description: Error durante el inicio de sesión
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {

        if (!username || !password) {
            return res.status(400).json({ status: false, message: 'Username and password are required' });
        }
        // Buscar usuario por nombre de usuario y contraseña
        const user = await prisma.usuario.findFirst({
            where: {
                nombre_usuario: username,
                contrasena: password
            },
            include: {
                rolUsuario: true // Incluir el rol del usuario en la respuesta
            }
        });

        // Si se encontró un usuario, responder con éxito y generar token
        if (user) {
            const token = jwt.sign({ userId: user.id_usuario, userType: 'usuario' }, 'your-secret-key', { expiresIn: '1h' });
            res.json({ status: true, token, userType: 'usuario', role: user.rolUsuario.nombre_rol, message: 'Login successful' });
            return;
        }

        // Si no se encontró un usuario, buscar cliente por correo electrónico y contraseña
        const cliente = await prisma.cliente.findFirst({
            where: {
                correo_electronico: username,
                contrasenia: password
            }
        });

        // Si se encontró un cliente y está activo, responder con éxito y generar token
        if (cliente && cliente.estado === 1) {
            const token = jwt.sign({ clientId: cliente.id_cliente, userType: 'cliente' }, 'your-secret-key', { expiresIn: '1h' });
            res.json({ status: true, token, userType: 'cliente', message: 'Login successful' });
            return;
        }

        // Si el cliente está inactivo, responder con error
        if (cliente && cliente.estado === 0) {
            res.status(403).json({ status: false, message: 'Client account is inactive' });
            return;
        }

        // Si no se encontró ni usuario ni cliente, responder con error
        res.status(404).json({ status: false, message: 'Invalid username or password' });
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ status: false, message: 'Error during login' });
    }
});

export default router;
