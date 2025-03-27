import Router from "@koa/router";
import prisma from "../../prisma/client.js";
import { Character } from "@prisma/client";

const router = new Router({
  prefix: "/character",
});

router.get("/", async (ctx) => {
  try {
    const characters = await prisma.character.findMany();
    ctx.status = 200; // Changed to 200 since it's a successful GET request
    ctx.body = characters;
  } catch (error: unknown) { // Specify 'unknown' type for 'error'
    if (error instanceof Error) { // Check if 'error' is an instance of Error
      ctx.status = 500; // Internal Server Error
      ctx.body = { message: "An error occurred while fetching characters", error: error.message };
    } else {
      ctx.status = 500; // If the error is not an instance of Error, return a generic message
      ctx.body = { message: "An unknown error occurred" };
    }
  }
});

router.post("/character", async (ctx) => {
  try {
    const data = ctx.request.body as Character;

    const character = await prisma.character.create({
      data: {
        name: data.name,
        history: data.history,
        age: data.age,
        health: data.health,
        stamina: data.stamina,
        mana: data.mana
      }
    });

    ctx.status = 201;
    ctx.body = "Character created: " + character.id;
  } catch (error: unknown) { // Specify 'unknown' type for 'error'
    if (error instanceof Error) { // Check if 'error' is an instance of Error
      ctx.status = 400; // Bad Request in case of validation issues or other client-side errors
      ctx.body = { message: "An error occurred while creating the character", error: error.message };
    } else {
      ctx.status = 400; // If the error is not an instance of Error, return a generic message
      ctx.body = { message: "An unknown error occurred" };
    }
  }
});

export default router;
