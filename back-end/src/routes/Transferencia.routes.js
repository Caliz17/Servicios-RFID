import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las transferencias
router.get('/transferencias', async (req, res) => {
    const transferencias = await prisma.transferencia.findMany();
    res.json(transferencias);
});

export default router;