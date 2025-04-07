import Router from "@koa/router";
import prisma from "../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";

const router = new Router();

// GET /class/:classId/skill/mod: ottenere tutti i modificatori di skill per ogni classe
router.get(
  "/class/:classId/skill/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const classId = ctx.params // Sostituisci con l'ID reale

      const skillModsForClass = await prisma.classSkillMod.findMany({
        where: {
          idClass: classId, // Filtra per l'ID della classe
        },
        include: {
          skill: true, // Include i dettagli della skill
        },
      });

      ctx.status = 200;
      ctx.body = skillModsForClass;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Errore: " + error;
    }
  }
);

export default router;
