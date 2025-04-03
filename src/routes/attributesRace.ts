import Router from "@koa/router";
import prisma from "../../prisma/client";
import { USER_ROLE } from "@prisma/client";
import { authUser, userRole } from "../middlewares/middlewareAuth";

const router = new Router();

// GET /race/:raceId/attribute/mod: ottenere tutti i modificatori degli attributi per ogni razza
router.get(
  "/race/:raceId/attribute/mod",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const raceId = ctx.params // Sostituisci con l'ID reale

      const attributeModsForRace = await prisma.raceAttrMod.findMany({
        where: {
          idRace: raceId, // Filtra per l'ID della razza
        },
        include: {
          attribute: true, // Include i dettagli degli attributi
        },
      });

      ctx.status = 200;
      ctx.body = attributeModsForRace;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Errore: " + error;
    }
  }
);

export default router;
