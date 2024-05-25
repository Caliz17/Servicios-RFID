import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las tarjetas
router.get('/tarjetas', async (req, res) => {
    const tarjetas = await prisma.tarjetaRfid.findMany();
    res.json(tarjetas);
});

export default router;