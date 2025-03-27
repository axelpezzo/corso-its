import Router from "@koa/router";
import prisma from "../../prisma/client.ts";
import { Skill } from "@prisma/client";

const router = new Router({
  prefix: "/skill",
});

// Endpoint GET per recuperare tutte le skill
router.get("/", async (ctx) => {
  try {
    const skills = await prisma.skill.findMany();  // Modificato da 'skill' a 'skills'
    ctx.status = 200; // Successo
    ctx.body = skills;  // Restituisce tutte le skill
  } catch (error: unknown) {
    if (error instanceof Error) {
      ctx.status = 500; // Errore interno del server
      ctx.body = { message: "An error occurred while fetching skills", error: error.message };
    } else {
      ctx.status = 500; // Errore sconosciuto
      ctx.body = { message: "An unknown error occurred" };
    }
  }
});

// Endpoint POST per creare una nuova skill
router.post("/skill", async (ctx) => {
  try {
    const data = ctx.request.body as Skill;

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        value: data.value
      }
    });

    ctx.status = 201; // Creazione riuscita
    ctx.body = "Skill created: " + skill.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      ctx.status = 400; // Richiesta errata, potrebbe esserci un problema di validazione
      ctx.body = { message: "An error occurred while creating the skill", error: error.message };
    } else {
      ctx.status = 400; // Errore sconosciuto
      ctx.body = { message: "An unknown error occurred" };
    }
  }
});

export default router;
