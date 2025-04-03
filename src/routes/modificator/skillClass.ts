import Router from "@koa/router";
import prisma from "../../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../../middlewares/middlewareAuth";

const router = new Router({
  prefix: "/mod/class",
});

// GET /mod/class/:idClass/skill: get single class with relative skills
router.get(
  "/:idClass/skill",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const idClass = ctx.params.idClass;

    try {
      const clazz = await prisma.classSkillMod.findMany({
        where: {
          idClass,
        },
        include: {
          skill: true,
        },
      });

      if (!clazz) {
        ctx.status = 404;
        ctx.body = { error: "class not found" };
        return;
      } else {
        ctx.status = 201;
        ctx.body = clazz;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Unable to find the requested class information" };
    }
  }
);

export default router;
