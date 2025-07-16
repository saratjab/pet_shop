import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./docs/opanapi";
import swaggerUi from 'swagger-ui-express';

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

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openApiDocument),
};