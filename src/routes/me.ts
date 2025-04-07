import Router from "@koa/router";
import { authUser } from "../middlewares/middlewareAuth";

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
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user information
 *     tags: 
 *      - Me (User Profile)
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *        description: Unauthorized
 *       500:
 *          description: Internal server error
 */
router.get("/", authUser, async (ctx) => {
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
