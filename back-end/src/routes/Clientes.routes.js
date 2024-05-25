import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - direccion
 *         - telefono
 *         - correo_electronico
 *         - contrasenia
 *         - perfil
 *       properties:
 *         id_cliente:
 *           type: integer
 *           description: Identificador único del cliente
 *         nombre:
 *           type: string
 *           description: Nombre del cliente
 *         apellido:
 *           type: string
 *           description: Apellido del cliente
 *         direccion:
 *           type: string
 *           description: Dirección del cliente
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del cliente
 *         contrasenia:
 *           type: string
 *           description: Contraseña del cliente
 *         perfil:
 *           type: string
 *           description: Perfil del cliente
 *         estado:
 *           type: integer
 *           description: Estado del cliente (1 para activo, 0 para inactivo)
 *       example:
 *         id_cliente: 1
 *         nombre: "Juan"
 *         apellido: "Perez"
 *         direccion: "Calle Falsa 123"
 *         telefono: "123456789"
 *         correo_electronico: "juan.perez@example.com"
 *         contrasenia: "password123"
 *         perfil: "admin"
 *         estado: 1
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene una lista de clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/clientes', async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.json({ status: true, data: clientes });
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error fetching clients' });
    }
});

/**
 * @swagger
 * /api/cliente/{id}:
 *   get:
 *     summary: Obtiene un cliente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 */
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

/**
 * @swagger
 * /api/newClient:
 *   post:
 *     summary: Crea un nuevo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado
 *       500:
 *         description: Error creando el cliente
 */
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

/**
 * @swagger
 * /api/updateClientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       500:
 *         description: Error actualizando el cliente
 */
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

/**
 * @swagger
 * /api/downClient/{id}:
 *   put:
 *     summary: Desactiva un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       201:
 *         description: Cliente desactivado
 *       500:
 *         description: Error desactivando el cliente
 */
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

/**
 * @swagger
 * /api/upClient/{id}:
 *   put:
 *     summary: Activa un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       201:
 *         description: Cliente activado
 *       500:
 *         description: Error activando el cliente
 */
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