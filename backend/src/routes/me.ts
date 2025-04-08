import Router from "@koa/router";
import { authUser } from "../middlewares/middlewareAuth";
import { authJWT } from "../middlewares/middlewareJWT";

/**
 * @swagger
 * tags:
 *   name: Me (User Profile)
 *   description: User profile information
 */

const router = new Router({
  prefix: "/me",
});

// GET /: get user information
router.get("/", authJWT, authUser, async (ctx) => {
  const user = ctx.state.user;
  try {
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Unauthorized" };
      return;
    }

    ctx.status = 200;
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error: " + error;
  }
});

export default router;
