import Router from "@koa/router";
import prisma from "../../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../../middlewares/middlewareAuth";

const router = new Router({
  prefix: "/class"
});

// GET /class/with/skills get all classes with relative skills
router.get(
    "/with/skills",
    authUser,
    (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
    async (ctx) => {
      try {
        const classes = await prisma.class.findMany({
            include: {
              classSkillMod: {
                  select: {
                    skill: true,
                  },
              },
            },
        });
        ctx.status = 201;
        ctx.body = classes;
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: "Unable to find classes information" };
      }
    }
);

// GET /class/:id/with/skills: get single class with relative skills
router.get(
  "/:id/with/skills",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const clazz = await prisma.class.findUnique({
        where: {
          id: id,
        },
        include:{
          classSkillMod: {
            select: {
              skill: true,
            },
          },
        }
      });

      if (!clazz) {
        ctx.status = 404;
        ctx.body = { error: "class not found"};
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