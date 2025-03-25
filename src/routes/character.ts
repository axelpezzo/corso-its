import Router from "@koa/router";
import prisma from "../../prisma/client.js";
import { Character } from "@prisma/client";

const router = new Router({
  prefix: "/character",
});

// GET  /: retireve all characters
router.get("/", async (ctx) => {
  const characters = await prisma.character.findMany();

  ctx.status = 201;
  ctx.body = characters;
});

// POST /: create a new character
router.post("/", async (ctx) => { 
  const data = ctx.request.body as Character

  const character = await prisma.character.create({
    data: {
      name: data.name,
      history: data.history,
      age: data.age,
      health: data.health,
      mana: data.mana,
      stamina: data.stamina
    },
  });

  ctx.status = 201;
  ctx.body = "Character created: ",character;

});

export default router;