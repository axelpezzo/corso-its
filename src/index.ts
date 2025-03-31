import Koa from "koa";
import Router from "@koa/router";
import dotenv from "dotenv";
import characterRoutes from "./routes/character.js";
import raceAttrModRoutes from "./routes/raceAttrMod.ts";
import classRoutes from "./routes/class.ts";
import bodyParser from "koa-bodyparser";

// Init "dotenv"
dotenv.config();

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(characterRoutes.routes()).use(characterRoutes.allowedMethods());
app.use(raceAttrModRoutes.routes()).use(RaceAttrModRoutes.allowedMethods());
app.use(classRoutes.routes()).use(classRoutes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT || 3000);
