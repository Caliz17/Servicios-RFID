import { Router } from "express";
import { prisma } from './db.js';

export async function registrarAuditoria(accion, tabla_afectada, id_registro_afectado, id_usuario) {
  const fecha_hora = new Date();
  try {
    await prisma.auditoria.create({
      data: {
        fecha_hora,
        accion,
        tabla_afectada,
        id_registro_afectado,
        id_usuario
      }
    });
    console.log('Auditoría registrada con éxito');
  } catch (err) {
    console.error('Error al registrar auditoría:', err);
  }
}
