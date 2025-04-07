import Koa from "koa";
import Router from "@koa/router";
import dotenv from "dotenv";
import characterRoutes from "./routes/character";
import attributeRoutes from "./routes/attribute";
import raceAttrModRoutes from "./routes/raceAttrMod";
import classRoutes from "./routes/class";
import skillRoutes from "./routes/skill";
import raceRoute from "./routes/race";
import bodyParser from "koa-bodyparser";
import userRouter from "./routes/user";
import meRouter from "./routes/me";
import classSkillModRoutes from "./routes/classSkillMod";
import swaggerJSDoc from "swagger-jsdoc";
import { koaSwagger } from 'koa2-swagger-ui';


// Init "dotenv"
dotenv.config();

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get("/", (ctx) => {
  ctx.response.body = "GDR Node";
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentazione DGR Node',
      version: '1.0.0'
    },
    servers: [
      {
          url: `http://localhost:${process.env.APP_PORT || 3000}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec= swaggerJSDoc(swaggerOptions);

router.get("/swagger.json", (ctx) => {
  ctx.response.body = swaggerSpec
});

app.use(koaSwagger({
  routePrefix: "/docs",
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

app.use(characterRoutes.routes()).use(characterRoutes.allowedMethods());
app.use(attributeRoutes.routes()).use(attributeRoutes.allowedMethods());
app.use(classSkillModRoutes.routes()).use(classSkillModRoutes.allowedMethods());
app.use(raceAttrModRoutes.routes()).use(raceAttrModRoutes.allowedMethods());
app.use(classRoutes.routes()).use(classRoutes.allowedMethods());
app.use(skillRoutes.routes()).use(skillRoutes.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(raceRoute.routes()).use(raceRoute.allowedMethods());
app.use(meRouter.routes()).use(meRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(
    `Server running --> http://localhost:${process.env.APP_PORT || 3000}\n`
    +
    `Docs section --> http://localhost:${process.env.APP_PORT || 3000}/docs`
  );
});
