import Router from "@koa/router";
import prisma from "../../prisma/client";
import { Skill, USER_ROLE } from "@prisma/client";
import { skillExists } from "../middlewares/middlewareSkill";
import { skillSchema } from "../../prisma/validation/validationSkill";
import { validationError } from "../utilities/errorsHandler";
import { ZodError } from "zod";
import { authUser, userRole } from "../middlewares/middlewareAuth";
import { authJWT } from "../middlewares/middlewareJWT";

const router = new Router({
  prefix: "/skill",
});

/**
 * @swagger
 * /skill:
 *   get:
 *     summary: Retrieve all skills
 *     tags: [Skill]
 *     responses:
 *       200:
 *         description: A list of skills.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Skill"
 *       500:
 *         description: Internal server error.
 */


// GET /: retrieve all skills
router.get(
  "/",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      const skills = await prisma.skill.findMany();
      ctx.status = 200;
      ctx.body = skills;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /skill:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Skill"
 *     responses:
 *       201:
 *         description: Skill created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Skill"
 *       500:
 *         description: Internal server error.
 */


// POST /: create a skill
router.post(
  "/",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    try {
      ctx.request.body = skillSchema.parse(ctx.request.body);
      const data = ctx.request.body as Skill;

      // Gestione dell'attributo tramite connect o create
      const skill = await prisma.skill.create({
        data: {
          name: data.name,
          key: data.key,
          value: data.value,
          attribute: {
            connect: data.idAttribute ? { id: data.idAttribute } : undefined, // Connetti l'attributo esistente
            create: !data.idAttribute ? { key: "default_key", name: "Default Attribute", value: 0 } : undefined, // Crea un attributo se idAttribute non è fornito
          },
        },
      });

        ctx.status = 201;
        ctx.body = "Skill created: " + skill.id;
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
      ctx.status = 201;
      ctx.body = "Skill created: " + skill.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /skill/{id}:
 *   get:
 *     summary: Get a single skill
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Skill"
 *       404:
 *         description: Skill not found.
 *       500:
 *         description: Internal server error.
 */


// GET /:id: get single skill
router.get(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const skill = await prisma.skill.findUnique({
        where: {
          id: id,
        },
      });

      if (!skill) {
        ctx.status = 404;
        ctx.body = "Skill not found";
        return;
      } else {
        ctx.status = 200;
        ctx.body = skill;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);
      if (!skill) {
        ctx.status = 404;
        ctx.body = "Skill not found";
        return;
      } else {
        ctx.status = 200;
        ctx.body = skill;
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /skill/{id}:
 *   patch:
 *     summary: Update a skill
 *     tags: [Skill]
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
 *             $ref: "#/components/schemas/Skill"
 *     responses:
 *       200:
 *         description: Skill updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Skill"
 *       500:
 *         description: Internal server error.
 */

// PATCH /:id: update single skill
router.patch(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  skillExists,
  async (ctx) => {
    const id = ctx.params.id;
    const data = ctx.request.body as Skill;

    try {
      const skill = await prisma.skill.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          key: data.key,
          value: data.value,
          attribute: {
            connect: data.idAttribute ? { id: data.idAttribute } : undefined, // Connetti l'attributo esistente
            create: !data.idAttribute ? { key: "default_key", name: "Default Attribute", value: 0 } : undefined, // Crea un attributo se idAttribute non è fornito
          },
        },
      });

      ctx.status = 200;
      ctx.body = "Skill updated: " + skill.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);
      ctx.status = 200;
      ctx.body = "Skill updated: " + skill.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /skill/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error.
 */


// DELETE /:id: delete single skill
router.delete(
  "/:id",
  authJWT,
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  skillExists,
  async (ctx) => {
    const id = ctx.params.id;

    try {
      const skill = await prisma.skill.delete({
        where: {
          id: id,
        },
      });

      ctx.status = 200;
      ctx.body = "Skill deleted: " + skill.id;
    } catch (error) {
      ctx.status = 500;
      ctx.body = "Error: " + error;
    }
  }
);

/**
 * @swagger
 * /skill/attribute/{id}:
 *   get:
 *     summary: Retrieve all skills associated with a given attribute
 *     tags: [Skill]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of skills.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Skill"
 *       404:
 *         description: No skills found.
 *       500:
 *         description: Internal server error.
 */


router.get(
  "/attribute/:id",
  authUser,
  (ctx, next) => userRole(ctx, next, USER_ROLE.ADMIN),
  async (ctx) => {
    const { id } = ctx.params;

    try {
      const skills = await prisma.skill.findMany({
        where: {
          idAttribute: id,
        },
      });

      if (!skills.length) {
        ctx.status = 404;
        ctx.body = { message: "Nessuna skill trovata" };
        return;
      }

      ctx.status = 200;
      ctx.body = skills;
    } catch (error) {
      if (error instanceof Error) {
        ctx.status = 500;
        ctx.body = { error: "Errore interno del server", details: error.message };
      } else {
        ctx.status = 500;
        ctx.body = { error: "Errore sconosciuto" };
      }
    }
  }
);

export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The skill ID.
 *         name:
 *           type: string
 *           description: The skill name.
 *         key:
 *           type: string
 *           description: The skill key.
 *         value:
 *           type: integer
 *           description: The value name.
 *         idAttribute:
 *           type: string
 *           description: The attribute id.
 */
