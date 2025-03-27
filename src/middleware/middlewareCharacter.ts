import { Context, Next } from "koa";
import prisma from "../../prisma/client.js";

export const checkCharacterExist = async (ctx: Context, next: Next) => {
    const id = ctx.params.id;

    const character = await prisma.character.findUnique({
        where : {
          id: id,
        },
      })

    if(!character) {
        ctx.status = 404;
        ctx.body = "Character not found"
    } else {
        await next();
    }
    return character;
}