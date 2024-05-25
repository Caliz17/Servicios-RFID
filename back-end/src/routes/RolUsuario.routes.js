import { Router } from "express";
import { prisma } from '../db.js';

const router = Router();


// lista todas las roles
router.get('/roles', async (req, res) => {
    const roles = await prisma.rolUsuario.findMany();
    res.json(roles);
});

export default router;