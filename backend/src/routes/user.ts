import Router from "@koa/router";
import { Prisma, User } from "@prisma/client";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { COOKIE_SESSION_NAME } from "../consts";
import { authUser } from "../middlewares/middlewareAuth";
import { userSchema } from "../../prisma/validation/validationUser";
import { authJWT } from "../middlewares/middlewareJWT";

const router = new Router({
  prefix: "/user",
});

/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: User and session management 
 */


// POST: /user/register: create a new user
/**
 *  @swagger
 *  /user/register:
 *    post:
 *      summary: Register a new user
 *      description: Creates a new user account with email and password
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *        201:
 *          description: User created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Error creating user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post("/register", authJWT, async (ctx) => {
  ctx.request.body = userSchema.parse(ctx.request.body);
  const { email, password } = ctx.request.body as User;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    ctx.status = 201;
    ctx.body = { message: "User created", user };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        ctx.status = 409;
        ctx.body = { error: "User mail duplicated" };
      }
    } else {
      ctx.status = 500;
      ctx.body = { error: "Error creating user" };
    }
  }
});

// POST: /user/login: login a user
/**
 *  @swagger
 *  /user/login:
 *    post:
 *      summary: User login
 *      description: Authenticates a user and returns a session cookie
 *      tags:
 *        - User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *        200:
 *          description: Login successful
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "Login successful as a@b.c"
 *        401:
 *          description: Invalid credentials
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          description: Error logging in
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post("/login", authJWT, async (ctx) => {
  const { email, password } = ctx.request.body as User;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Invalid credentials" };
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      ctx.status = 401;
      ctx.body = { error: "Invalid credentials" };
      return;
    }

    // Session ID generation
    const sessionId = crypto.randomBytes(32).toString("hex");
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionId,
      },
    });

    ctx.cookies.set(COOKIE_SESSION_NAME, sessionId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    ctx.status = 200;
    ctx.body = { message: "Login successful", user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error logging in" };
  }
});

// POST: /user/logout: logout a user
/**
 *  @swagger
 *  /user/logout:
 *    post:
 *      summary: User logout
 *      description: Logs out a user by invalidating their session
 *      tags:
 *        - User
 *      security:
 *        - cookieAuth: []
 *      responses:
 *        200:
 *          description: Logout successful
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "Logout successful"
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          description: Error logging out
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.post("/logout", authJWT, authUser, async (ctx) => {
  const sessionId = ctx.cookies.get(COOKIE_SESSION_NAME);

  if (!sessionId) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  try {
    await prisma.session.delete({
      where: {
        sessionId,
      },
    });

    ctx.cookies.set(COOKIE_SESSION_NAME, "", {
      httpOnly: true,
      maxAge: 0,
    });

    ctx.status = 200;
    ctx.body = { message: "Logout successful" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error logging out" };
  }
});

// PATCH: /user/:id: update user
/**
 *  @swagger
 *  /user/{id}:
 *    patch:
 *      summary: Update user
 *      description: Updates a user's email and/or password
 *      tags:
 *        - User
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The user ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInputOptional'
 *      responses:
 *        200:
 *          description: User updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "User updated"
 *        500:
 *          description: Error updating user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.patch("/:id", authUser, async (ctx) => {
  const id = ctx.params.id;
  const { email, password } = ctx.request.body as User;
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    ctx.status = 200;
    ctx.body = { message: "User updated" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Error updating user" };
  }
});

// DELETE: /user/:id: delete user
/**
 *  @swagger
 *  /user/{id}:
 *    delete:
 *      summary: Delete user
 *      description: Deletes a user account permanently from the system
 *      tags:
 *        - User
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: The unique identifier of the user to delete
 *      responses:
 *        200:
 *          description: User deleted successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *                example: "User deleted"
 *        401:
 *          description: Unauthorized - User not authenticated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authUser, async (ctx) => {
  const id = ctx.params.id;

  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  ctx.status = 200;
  ctx.body = { message: "User deleted" };
});

export default router;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: The user ID
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address
 *          password:
 *            type: string
 *            description: The user's hashed password (not returned in responses)
 *          role:
 *            type: string
 *            enum: [USER, ADMIN]
 *            description: The user's role
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: When the user was created
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: When the user was last updated
 *      UserInput:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address
 *          password:
 *            type: string
 *            description: The user's password (not returned in responses)
 *        required:
 *          - email
 *          - password
 *      UserInputOptional:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address
 *          password:
 *            type: string
 *            description: The user's password (not returned in responses)
 */
