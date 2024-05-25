import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las tcuentas
router.get('/tcuentas', async (req, res) => {
    const tcuentas = await prisma.tipoCuenta.findMany();
    res.json(tcuentas);
});

export default router;