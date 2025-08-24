import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import {
  filteredPetResponseSchema,
  filterPetsQueryAndPaginationSchema,
  petIdDeleteSchema,
  petIdParamSchema,
  petResponseSchema,
  petTagDeleteSchema,
  petTagParamSchema,
  registerPetSchema,
  updatePetSchema,
} from '../schemas/petSchema';

const petPath = '/api/pets';

export const registerPetDocs = (registry: OpenAPIRegistry): void => {
  registry.register('RegisterPet', registerPetSchema);
  registry.register('PerResponse', petResponseSchema);
  registry.register('FilterQuery', filterPetsQueryAndPaginationSchema);
  registry.register('FilteredPetResponse', filteredPetResponseSchema);
  registry.register('PetIDParam', petIdParamSchema);
  registry.register('PetTagParam', petTagParamSchema);
  registry.register('UpdatePet', updatePetSchema);
  registry.register('PetIDDelete', petIdDeleteSchema);
  registry.register('PetTagDelete', petTagDeleteSchema);

  registry.registerPath({
    path: `${petPath}/`,
    method: 'post',
    summary: 'creating a new pet',
    tags: ['Pets'],
    description: `Creates a new pet profile.
        \nRequires authentication.
        \nAccepts pet details in the request body and returns the created pet on success.`,
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: registerPetSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Register Pet',
        content: {
          'application/json': {
            schema: petResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'pet tag must be at least 1 character',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/`,
    method: 'get',
    summary: 'get all pets',
    tags: ['Pets'],
    description: `Retrieves a list of pets with optional filters and pagination.
        \nYou can filter by pet attributes (e.g., type, age) and control results using query parameters like page and limit.`,
    request: {
      query: filterPetsQueryAndPaginationSchema,
    },
    responses: {
      200: {
        description: 'get filtered pets successfully',
        content: {
          'application/json': {
            schema: filteredPetResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Age must be a positive number',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/{id}`,
    method: 'get',
    summary: 'get pet by ID',
    tags: ['Pets'],
    description: `Retrieves a specific pet's details by their unique ID.
        \nThis route is protected and typically used by authenticated users to view full pet information.`,
    security: [{ bearerAuth: [] }],
    request: {
      params: petIdParamSchema,
    },
    responses: {
      200: {
        description: 'get filtered pets successfully',
        content: {
          'application/json': {
            schema: petResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid MongoDB ObjectId',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Pet not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/tag/{petTag}`,
    method: 'get',
    summary: 'get pet by pet tag',
    tags: ['Pets'],
    description: `Fetches a pet's details using its unique tag.
        \nUseful when identifying pets by tag instead of ID.`,
    request: {
      params: petTagParamSchema,
    },
    responses: {
      200: {
        description: 'get filtered pets successfully',
        content: {
          'application/json': {
            schema: petResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'pet tag must be at least 1 character',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Pet not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/{id}`,
    method: 'patch',
    summary: 'update pet by ID',
    tags: ['Pets'],
    description: `Update the details of an existing pet using its unique ID. 
        \nRequires authentication. 
        \nOnly authorized users 'admin' can perform this action. 
        \nFields that can be updated include name, age, breed, tag, and more.`,
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: updatePetSchema,
          },
        },
      },
      params: petIdParamSchema,
    },
    responses: {
      200: {
        description: 'update pet successfully',
        content: {
          'application/json': {
            schema: petResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'pet tag must be at least 1 character',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/tag/{petTag}`,
    method: 'patch',
    summary: 'update pet by pet tag',
    tags: ['Pets'],
    description: `Update the details of an existing pet using its unique pet tag. 
        \nRequires authentication. 
        \nOnly authorized users 'admin/ employee' can perform this action. 
        \nFields that can be updated include name, age, breed, tag, and more.`,
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: updatePetSchema,
          },
        },
      },
      params: petTagParamSchema,
    },
    responses: {
      200: {
        description: 'update pet successfully',
        content: {
          'application/json': {
            schema: petResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'pet tag must be at least 1 character',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/bluk/id`,
    method: 'delete',
    summary: 'delete pet by ID',
    tags: ['Pets'],
    security: [{ bearerAuth: [] }],
    description: `Allows authorized users to delete multiple pets by providing their IDs in the request body. 
        \nRequires authentication. 
        \nUseful for batch deletion operations.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: petIdDeleteSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'No content',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'you deleted pets',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid MongooDB ObjectId',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${petPath}/bluk/petTag`,
    method: 'delete',
    summary: 'delete pet by pet tags',
    tags: ['Pets'],
    security: [{ bearerAuth: [] }],
    description: `Allows authorized users to delete multiple pets by providing their pet tags in the request body. 
        \nRequires authentication. 
        \nUseful for batch deletion operations.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: petTagDeleteSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'No content',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'you deleted pets',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'pet tag must be at least 1 character',
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'Token is blacklisted',
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Access denied. You are not authorized.',
                },
              },
            },
          },
        },
      },
    },
  });
};
