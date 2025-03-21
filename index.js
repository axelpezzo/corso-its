import Koa from "koa";
import Router from "@koa/router";
import { config } from "dotenv";

// Init "dotenv"
config();

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Hello World 123!";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT || 3000);
