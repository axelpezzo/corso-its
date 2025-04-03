import Router from "@koa/router";
import prisma from "../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";

const router = new Router();

// GET /class/skill/mod: ottenere tutti i modificatori di skill per ogni classe
router.get(
  "/class/skill/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const classesWithSkillMods = await prisma.class.findMany({
        include: {
          classSkillMod: {
            include: {
              skill: true,
            },
          },
        },
      });

      ctx.status = 200;
      ctx.body = classesWithSkillMods;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Errore: " + error;
    }
  }
);

// GET /class/:classId/skill/:skillId/mod - Ottiene il modificatore di una skill associata a una classe
router.get(
  "/class/:classId/skill/:skillId/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    const { classId, skillId  } = ctx.params;

    try {
      const modifier = await prisma.classSkillMod.findFirst({
        where: {
          idClass: classId,
          idSkill: skillId,
        },
        include: {
          skill: true,
          class: true,
        },
      });

      if (!modifier) {
        ctx.status = 404;
        ctx.body = "Modificatore non trovato";
        return;
      }

      ctx.status = 200;
      ctx.body = {
        classId: modifier.class.id,
        className: modifier.class.name,
        skillId: modifier.skill.id,
        skillName: modifier.skill.name,
        modifierValue: modifier.value,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

export default router;
