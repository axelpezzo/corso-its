import swaggerJSDoc from "swagger-jsdoc";
import koa from "koa";


const app = new koa();

// Configurazione di Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API",
      version: "1.0.0",
      description: "Documentazione DGR Node",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Server locale",
      },
    ], 
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);