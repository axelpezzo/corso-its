import Router from "@koa/router";
import prisma from "../../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../../middlewares/middlewareAuth";

const router = new Router({
    prefix: "/race",
});

// GET /race/with/attributes get all races with relative attributes
router.get(
    "/with/attributes",
    authUser,
    (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
    async (ctx) => {
      try {
        const races = await prisma.race.findMany({
            include:{
              raceAttrMod: {
                select: {
                  attribute: true,
                }
              },
            },
        });
        ctx.status = 201;
        ctx.body = races;
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Unable to find races information`};
      }
    }
);

// GET /race/:id/with/attributes get a race with relative attributes
router.get(
    "/:id/with/attributes",
    authUser,
    (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
    async (ctx) => {
      const id = ctx.params.id;
  
      try {
        const race = await prisma.race.findUnique({
          where: {
            id: id,
          },
          include:{
            raceAttrMod:{
              select: {
                attribute: true,
              }
            },
          }
        });
  
        if (!race) {
          ctx.status = 404;
          ctx.body = { error: "Race not found"};
          return;
        } else {
          ctx.status = 201;
          ctx.body = race;
        }
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Unable to find the requested race information` };
      }
    }
);

export default router;