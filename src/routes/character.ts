import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Character, USER_ROLE } from "@prisma/client";
import { characterExists } from "../middlewares/middlewareCharacter";
import { characterSchema } from "../../prisma/validation/validationCharacter";
import { validationError } from "../utilities/errorsHandler";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { ZodError } from "zod";
import { authJWT } from "../middlewares/middlewareJWT";

const router = new Router({
  prefix: "/character",
});

/**
 * @swagger
 * /character:
 *   get:
 *     summary: Retrieve all characters for the authenticated user
 *     tags: [Character]
 *     responses:
 *       200:
 *         description: A list of characters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Character"
 *       500:
 *         description: Internal server error.
 */


// GET /: retrive all characters
router.get(
  "/",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    try {
      const characters = await prisma.character.findMany({
        where: {
          userId: ctx.state.user.id,
        },
      });
      ctx.status = 201;
      ctx.body = characters;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /character:
 *   post:
 *     summary: Create a new character
 *     tags: [Character]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Character"
 *     responses:
 *       201:
 *         description: Character created successfully.
 *         content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Character created: 183adef0-ecba-4546-bd1e-e9a2a8b4bd51"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

// POST /: create a character
router.post(
  "/",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    try {
      ctx.request.body = characterSchema.parse(ctx.request.body);
      const data = ctx.request.body as Character;

      try {
        const character = await prisma.character.create({
          data: {
            name: data.name,
            history: data.history,
            age: data.age,
            health: data.health,
            stamina: data.stamina,
            mana: data.mana,
            idClass: data.idClass,
            idRace: data.idRace,
            userId: ctx.state.user.id,
          },
        });

        ctx.status = 201;
        ctx.body = "Character created: " + character.id;
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
 * /character/{id}:
 *   get:
 *     summary: Get a character by ID
 *     tags: [Character]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The character ID.
 *     responses:
 *       200:
 *         description: Character found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Character"
 *       404:
 *         description: Character not found.
 *       500:
 *         description: Internal server error.
 */

// GET /:id: get single character
router.get(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const character = await prisma.character.findUnique({
        where: {
          id: id,
          userId: ctx.state.user.id,
        },
      });

      if (!character) {
        ctx.status = 404;
        ctx.body = "Character not found";
        return;
      } else {
        ctx.status = 201;
        ctx.body = character;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /character/{id}:
 *   patch:
 *     summary: Update an existing character
 *     tags: [Character]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The character ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Character"
 *     responses:
 *       200:
 *         description: Character updated successfully.
 *         content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Character updated: 183adef0-ecba-4546-bd1e-e9a2a8b4bd51"
 *       404:
 *         description: Character not found.
 *       500:
 *         description: Internal server error.
 */

// PATCH /:id: update single character
router.patch(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  characterExists,
  async (ctx) => {
    const id = ctx.params.id;
    const data = ctx.request.body as Character;

    try {
      const character = await prisma.character.update({
        where: {
          id: id,
          userId: ctx.state.user.id,
        },
        data: {
          name: data.name,
          history: data.history,
          age: data.age,
          health: data.health,
          stamina: data.stamina,
          mana: data.mana,
        },
      });

      ctx.status = 201;
      ctx.body = "Character updated: " + character.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /character/{id}:
 *   delete:
 *     summary: Delete a character by ID
 *     tags: [Character]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The character ID.
 *     responses:
 *       200:
 *         description: Character deleted successfully.
 *         content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Character deleted: 183adef0-ecba-4546-bd1e-e9a2a8b4bd51"
 *       404:
 *         description: Character not found.
 *       500:
 *         description: Internal server error.
 */

// DELETE /:id: delete single character
router.delete(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.GUEST),
  characterExists,
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const character = await prisma.character.delete({
        where: {
          id: id,
          userId: ctx.state.user.id,
        },
      });

      ctx.status = 200;
      ctx.body = "Character deleted: " + character.id;
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
 *     Character:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The character ID.
 *         name:
 *           type: string
 *           description: The name of the character.
 *         history:
 *           type: string
 *           description: The backstory or lore of the character.
 *         age:
 *           type: integer
 *           description: The character's age.
 *         health:
 *           type: integer
 *           description: The base health points of the character.
 *         stamina:
 *           type: integer
 *           description: The base stamina of the character.
 *         mana:
 *           type: integer
 *           description: The base mana of the character.
 *         idClass:
 *           type: string
 *           description: The class ID associated with this character.
 *         idRace:
 *           type: string
 *           description: The race ID associated with this character.
 *         userId:
 *           type: string
 *           description: The user ID who owns this character.
 */
