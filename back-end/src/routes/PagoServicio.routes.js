import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las pagos
router.get('/Pagos', async (req, res) => {
    const pagos = await prisma.pagoServicio.findMany();
    res.json(pagos);
});

export default router;