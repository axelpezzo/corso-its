import Koa from "koa";
import Router from "@koa/router";
import dotenv from "dotenv";
import characterRoutes from "./routes/character.js";
import bodyParser from "koa-bodyparser";
import classSkillModRoutes from "./routes/classSkillMod.ts"

// Init "dotenv"
dotenv.config();

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get("/", (ctx) => {
    ctx.response.body = "GDR Node";
});

app.use(characterRoutes.routes()).use(characterRoutes.allowedMethods());
app.use(classSkillModRoutes.routes()).use(classSkillModRoutes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());







app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`HTTP Server running on http://localhost:${process.env.APP_PORT}`);
});