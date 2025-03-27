import Router from "@koa/router";
import prisma from "../../prisma/client.ts";
import { Character } from "@prisma/client";
import { characterExists } from "../middlewares/character.ts";

const router = new Router({
  prefix: "/character",
});

// get all characters
router.get("/", async (ctx) => {
  try {
    const characters = await prisma.character.findMany();
    ctx.status = 201;
    ctx.body = characters;
  } catch (error){
    ctx.status = 500;
    ctx.body = "Error: " + error;
  }
  
});

// post: create a character
router.post("/", async (ctx) => {
  const data = ctx.request.body as Character;
  try {
    const character = await prisma.character.create({
      data: {
        name: data.name,
        history: data.history,
        age: data.age,
        health: data.health,
        stamina: data.stamina,
        mana: data.mana,
      },
    });

    ctx.status = 201;
    ctx.body = "Character created: " + character.id;
  } catch (error){
    ctx.status = 500;
    ctx.body = "Error: " + error;
  }
});

// get one character, given the id
router.get("/:id", async (ctx) => {
  const id = ctx.params.id;

  try{
    const character = await prisma.character.findUnique({
      where: {
        id: id,
      },
    });

    if (!character){
      ctx.status = 404;
      ctx.body = "Character not found";
      return;
    }
    else {
      ctx.status = 201;
      ctx.body = character;
    }
  }catch (error){
    ctx.status = 500;
    ctx.body = "Error: " + error;
  }
  
  // patch
  router.patch("/:id", (ctx, next) => characterExists(ctx, next), async (ctx) => {
    const id = ctx.params.id;
    const data = ctx.request.body as Character;

    try{
      const character = await prisma.character.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          history: data.history,
          age: data.age,
          health: data.health,
          stamina: data.stamina,
          mana: data.mana,
        },
      });

      ctx.status = 201;
      ctx.body = "Character updated: " + character.id;
    } catch (error){
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  });
});

export default router;
