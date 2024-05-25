import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las usuarios
router.get('/usuarios', async (req, res) => {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
});

export default router;