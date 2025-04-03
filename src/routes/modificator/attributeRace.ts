import Router from "@koa/router";
import prisma from "../../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../../middlewares/middlewareAuth";

const router = new Router({
  prefix: "/mod/race",
});

// GET /mod/race/:id/attrb get a race with relative attributes
router.get(
  "/:idRace/attrb",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const idRace = ctx.params.idRace;

    try {
      const race = await prisma.raceAttrMod.findMany({
        where: {
          idRace,
        },
        include: {
          attribute: true,
        },
      });

      if (!race) {
        ctx.status = 404;
        ctx.body = { error: "Race not found" };
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
