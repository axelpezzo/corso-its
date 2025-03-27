import { Context } from "vm";
import prisma from "../../prisma/client.ts";
import { Next } from "koa";

export const characterExists = async (ctx: Context, next: Next) => {
    const id = ctx.params.id;
    const character = await prisma.character.findUnique({
        where: {
          id: id,
        },
    });

    if(!character){
        ctx.status = 404;
        ctx.body = "Character not found";
    }
    else {
        await next();
    }

    return character;
};