import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Race, USER_ROLE } from "@prisma/client";
import { raceSchema } from "../../prisma/validation/validationRace";
import { ZodError } from "zod";
import { validationError } from "../utilities/errorsHandler";
import { raceExists } from "../middlewares/middlewareRace";
import { authUser, userRole } from "../middlewares/middlewareAuth";

/**
 * @swagger
 * tags:
 *   name: Races
 *   description: API for crud operations on races
 */
const router = new Router({
  prefix: "/race",
});

/**
 * @swagger
 * /race:
 *   get:
 *     summary: Retrieve all races
 *     tags: [Races]
 *     responses:
 *       201:
 *         description: List of all races
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *       500:
 *         description: Internal server error
 */
// GET /: retrive all race
router.get(
  "/",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const races = await prisma.race.findMany();
      ctx.status = 201;
      ctx.body = races;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);
/** 
 * @swagger
 * /race:
 *   post:
 *     summary: Create a new race
 *     tags: [Races]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *     responses:
 *      201:
 *        description: Race created successfully
 *      400:
 *       description: Invalid data
 *      500:
 *       description: Internal server error 
 */
// POST /: create a race
router.post(
  "/",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      ctx.request.body = raceSchema.parse(ctx.request.body);
      const data = ctx.request.body as Race;

      try {
        const race = await prisma.race.create({
          data: {
            name: data.name,
            key: data.key,
            modHealth: data.modHealth,
            modStamina: data.modStamina,
            modMana: data.modMana,
          },
        });

        ctx.status = 201;
        ctx.body = "Race created: " + race.id;
      } catch (error) {
        ctx.status = 500;
        ctx.body = "Error: " + error;
      }
    } catch (error) {
      ctx.status = 500;
      if (error instanceof ZodError) {
        ctx.body = validationError(error);
      } else {
        ctx.body = "Generic Error: " + error;
      }
    }
  }
);

/**
 * @swagger
 * /race/{id}:
 *   get:
 *     summary: Retrieve a race by ID
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the race to retrieve
 *         schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *     responses:
 *       201:
 *         description: Race found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Race'
 *       404:
 *         description: Race not found
 *       500:
 *         Internal server error
 */
// GET /:id: get single race
router.get(
  "/:id",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const race = await prisma.race.findUnique({
        where: {
          id: id,
        },
      });

      if (!race) {
        ctx.status = 404;
        ctx.body = "Race not found";
        return;
      } else {
        ctx.status = 201;
        ctx.body = race;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /race/{id}:
 *   patch:
 *     summary: Update a race by ID
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the race to update
 *         schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Race'
 *     responses:
 *       201:
 *         description: Race updated successfully
 *       500:
 *         description: Internal server error
 */
// PATCH /:id: update single race
router.patch(
  "/:id",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  raceExists,
  async (ctx) => {
    const id = ctx.params.id;
    const data = ctx.request.body as Race;

    try {
      const race = await prisma.race.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          key: data.key,
          modHealth: data.modHealth,
          modStamina: data.modStamina,
          modMana: data.modMana,
        },
      });

      ctx.status = 201;
      ctx.body = "Race updated: " + race.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /race/{id}:
 *   delete:
 *     summary: Delete a race by ID
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the race to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Race deleted successfully
 *       500:
 *         description: Internal server error
 */
// DELETE /:id: delete single race
router.delete(
  "/:id",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  raceExists,
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const race = await prisma.race.delete({
        where: {
          id: id,
        },
      });

      ctx.status = 200;
      ctx.body = "Race deleted: " + race.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);
/**
 * @swagger
 * components:
 *  schemas:
 *  Race:
 *         type: object
 *           properties:
 *            name:
 *             type: string
 *            key:
 *            type: string
 *           modHealth:
 *            type: number
 *          modStamina:
 *           type: number
 *         modMana:
 *          type: number
 */

export default router;
