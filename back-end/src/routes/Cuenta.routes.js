import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();

// lista todos las cuentas
router.get('/cuentas', async (req, res) => {
    const cuentas = await prisma.cuenta.findMany();
    res.json(cuentas);
});

export default router;