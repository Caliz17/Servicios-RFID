import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las auditorias
router.get('/auditorias', async (req, res) => {
    const auditorias = await prisma.auditoria.findMany();
    res.json(auditorias);
});

export default router;