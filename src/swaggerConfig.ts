import swaggerJSDoc from "swagger-jsdoc";

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
  },

  apis: ['./src/routes/**/*.ts']
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);