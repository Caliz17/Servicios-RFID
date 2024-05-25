import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las tservicio
router.get('/tservicio', async (req, res) => {
    const tservicio = await prisma.tipoServicio.findMany();
    res.json(tservicio);
});

export default router;