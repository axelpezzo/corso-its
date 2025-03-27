import Router from "@koa/router";
import prisma from "../../prisma/client.js";
import { Character } from "@prisma/client";
import { checkCharacterExist } from "../middleware/middlewareCharacter.js";

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
  const data = ctx.request.body as Character;

  try{
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
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error" + error
  }

});


router.get("/:id", async (ctx) => {
  const id = ctx.params.id;

    try {
        const character = await prisma.character.findUnique({
          where : {
            id: id,
          },
        });

        if (!character) {
          ctx.status = 404;
          ctx.body = "Character not found";
        }
        ctx.status = 200;
        ctx.body = character

    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error" + error
    }
});

// PATCH /:id Update single character
router.patch("/:id", checkCharacterExist, async (ctx) => {
  const id = ctx.params.id;
  const data = ctx.request.body as Character;

    try {
      const character = await prisma.character.update({
        where : {
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
      })

      ctx.status = 201;
      ctx.body = "Character updated: ", character.id

    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error" + error
    }
});


router.delete("/:id", checkCharacterExist, async (ctx) => {
  const id = ctx.params.id;

  try {
    const character = await prisma.character.delete({
      where : {
        id: id,
      }
    });

    ctx.status = 200;
    ctx.body = "Character deleted correctly: ", character.id;

  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error: " + error  
  }
})


export default router;
