import Router from "@koa/router";
import { ZodError } from "zod";
import prisma from "../../prisma/client.ts";
import { validationError } from "../utilities/errorsHandler.ts";


const router = new Router({
    prefix: "";
});

// GET /: retrive all races attribute mode
router.get("/", async (ctx) => {
    try {
        const raceAttrMod = await prisma.raceAttrMod.findMany();
        ctx.status = 201;
        ctx.body = raceAttrMod;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error: " + error;
    }
});


// POST /: create a raceAttrMod
router.post("/", async (ctx) => {
    try {
      ctx.request.body = raceAttrModSchema.parse(ctx.request.body);
      const data = ctx.request.body as RaceAttrMod;
  
      try {
        const raceAttrMod = await prisma.raceAttrMod.create({
          data: {
            idRace: data.idRace,
            idAttribute: data.idAttribute,
            value: data.value,
          },
        });
  
        ctx.status = 201;
        ctx.body = "Race Attribute Relation added: " + raceAttrMod.id;
      } catch (error) {
        ctx.status = 500;
        ctx.body = "Error: " + error;
      }
    } catch (error) {
      ctx.status = 500;
      if (error instanceof ZodError) {
        ctx.body = validationError(error);
      } else {
        ctx.body = "Generic Error: " + error;
      }
    }
  });