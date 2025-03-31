import Router from "@koa/router";
import prisma from "../../prisma/client.ts";
import { Attribute } from "@prisma/client";
//import { characterExists } from "../middlewares/middlewareCharacter.ts";
import { attributeSchema } from "../../prisma/validation/validationAttribute.ts";
import { ZodError } from "zod";
import { validationError } from "../utilities/errorsHandler.ts";

const router = new Router({
    prefix: "/attribute",
  });
  
  // GET /: retrive all attribute
  router.get("/", async (ctx) => {
    try {
      const attribute = await prisma.attribute.findMany();
      ctx.status = 201;
      ctx.body = attribute;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  });
  
  // POST /: create a attribute
  router.post("/", async (ctx) => {
    try {
      ctx.request.body = attributeSchema.parse(ctx.request.body);
      const data = ctx.request.body as Attribute;
  
      try {
        const attribute = await prisma.attribute.create({
          data: {
            name: data.name,
            key: data.key,
            value: data.value,
            raceAttrMod: data.raceAttrMod
          },
        });
  
        ctx.status = 201;
        ctx.body = "attribute created: " + attribute.id;
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

  export default router;