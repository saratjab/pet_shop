import swaggerJSDoc from "swagger-jsdoc";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./opanapi";
import swaggerUi, { setup } from 'swagger-ui-express';

const generator = new OpenApiGeneratorV3(registry.definitions);

const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'User Auth API',
    description: 'API endpoints for user register and login',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Auth API',
      description: 'API endpoints for user register and login',
      version: '1.0.0',
    },

    servers: [
      {
        url: 'http://localhost:3000',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts']
};

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openApiDocument),
};