import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Race, USER_ROLE } from "@prisma/client";
import { raceSchema } from "../../prisma/validation/validationRace";
import { ZodError } from "zod";
import { validationError } from "../utilities/errorsHandler";
import { raceExists } from "../middlewares/middlewareRace";
import { authUser, userRole } from "../middlewares/middlewareAuth";

const router = new Router({
  prefix: "/race",
});

/**
 * @swagger
 * /race:
 *   get:
 *     summary: Retrieve all races
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Race
 *     responses:
 *       200:
 *         description: A list of races.
 *        content:
 *          application/json:
 *            schema:
 *       500:
 *         description: Server error.
 */

// GET /: retrive all race
router.get(
  "/",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
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
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Race
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RaceInput'
 *     responses:
 *       201:
 *         description: Race created.
 *       500:
 *         description: Server error.
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
 *     summary: Get a single race by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Race
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single race object.
 *       404:
 *         description: Race not found.
 *       500:
 *         description: Server error.
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
 *     summary: Update a single race
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Race
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Race'
 *     responses:
 *       200:
 *         description: Race updated.
 *       404:
 *         description: Race not found.
 *       500:
 *         description: Server error.
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
 *     summary: Delete a single race
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Race
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Race deleted.
 *       404:
 *         description: Race not found.
 *       500:
 *         description: Server error.
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

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Race:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Higth Elf"
 *         key:
 *           type: string
 *           example: "hight_elf"
 *         modHealth:
 *           type: integer
 *           example: 10
 *         modStamina:
 *           type: integer
 *           example: 8
 *         modMana:
 *           type: integer
 *           example: 12
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RaceInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Higth Elf"
 *         key:
 *           type: string
 *           example: "hight_elf"
 *         modHealth:
 *           type: integer
 *           example: 10
 *         modStamina:
 *           type: integer
 *           example: 8
 *         modMana:
 *           type: integer
 *           example: 12
 */
