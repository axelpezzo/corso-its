import Router from "@koa/router";


const router = new Router({ 
    prefix: "/character" 
});

router.get("/", async (ctx) => {
    const character = await prisma.character.findMany();
    
    ctx.status = 200;
    ctx.body = character;
});

