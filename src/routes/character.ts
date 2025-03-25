import Router from "@koa/router";
import prisma from "../prisma/client";
import { title } from "process";
import { Character } from "@prisma/client";


const router = new Router(
    {
        prefix: "/character",
    }
);

router.get("/", async (ctx) => {
    const characters = await prisma.character.findMany();
    ctx.status = 201;
    ctx.body = characters;
});

router.post("/character", async (ctx) => {

    const data = ctx.request.body as Character;

    const character = await prisma.character.create({
        data: {
            name: data.name,
            history: data.history,
            age: data.age,
            health: data.health,
            mana: data.mana,
            stamina: data.stamina,
        },
    });

    ctx.status = 201;
    ctx.body = "Character created: " + character.id;

});

export default router;