import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './docs/opanapi';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/envConfig';

const generator = new OpenApiGeneratorV3(registry.definitions);

const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Pet Shop APIs',
    description: 'API endpoints for Pet Shop',
    version: '1.0.0',
  },
  servers:
    env.node_env === 'development'
      ? [
          {
            url: 'http://localhost:3000',
            description: 'development server',
          },
        ]
      : [
          {
            url: 'http://localhost:8000',
            description: 'production server',
          },
        ],
});

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openApiDocument),
};
