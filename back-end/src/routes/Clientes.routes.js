import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todos los clientes
router.get('/clientes', async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
});

export default router;