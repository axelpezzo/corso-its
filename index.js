import Koa from "koa";
import Router from "@koa/router";
import { config } from "dotenv";

config();

const app = new Koa(); // Usa `Koa.default()` per istanziare l'app
const router = new Router();

router.get("/", (ctx) => {
    ctx.body = "Hello World 123!";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});
