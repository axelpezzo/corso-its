import { Context, Next } from "koa";
import prisma from "../../prisma/client.ts";

// Middleware per verificare se una skill esiste
export const skillExists = async (ctx: Context, next: Next) => {
  const id = ctx.params.id;  // Ottieni l'ID dalla URL (es. /skill/:id)
  const skill = await prisma.skill.findUnique({
    where: {
      id: id,
    },
  });

  if (!skill) {
    ctx.status = 404;
    ctx.body = "Skill not found";  // Risposta se la skill non è trovata
  } else {
    await next();  // Se la skill esiste, continua con il prossimo middleware o route handler
  }
};
