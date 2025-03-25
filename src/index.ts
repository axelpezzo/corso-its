import Koa from "koa";
import Router from "@koa/router";
import dotenv from "dotenv";
import { query } from "./db.js";

// Init "dotenv"
dotenv.config();

const app = new Koa();
const router = new Router();

router.get("/db", async (ctx) => {
  const result = await query("SELECT NOW()", "");
  ctx.body = result.rows;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT || 3000);
