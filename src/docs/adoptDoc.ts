import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { paginationQuerySchema } from '../schemas/paginationSchema';
import {
  adoptIdParamSchema,
  adoptionSchema,
  adoptPaginationSchema,
  adoptResponseSchema,
  cancelPetsSchema,
  paymentInfoSchema,
  paymentSchema,
} from '../schemas/adoptSchema';

export const adoptPath = '/api/adopts';

export const registerAdoptDocs = (registry: OpenAPIRegistry) => {
  registry.register('Adoption', adoptionSchema);
  registry.register('Pagination', paginationQuerySchema);
  registry.register('AdoptionResponse', adoptResponseSchema);
  registry.register('AdoptsGetResponse', adoptPaginationSchema);
  registry.register('PaymentInfo', paymentInfoSchema);
  registry.register('CancelPets', cancelPetsSchema);
  registry.register('AdoptIDParam', adoptIdParamSchema);

  registry.registerPath({
    path: `${adoptPath}/`,
    method: 'get',
    summary: 'get all adoptions',
    tags: ['Adoption'],
    security: [{ bearerAuth: [] }],
    description: `Retrieves a paginated list of all adoption records. 
        \nRequires authentication and is accessible only to authorized users 'admin'. 
        \nSupports pagination through query parameters.`,
    request: {
      query: paginationQuerySchema,
    },
    responses: {
      200: {
        description: 'get adoptions successfully',
        content: {
          'application/json': {
            schema: adoptPaginationSchema,
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
                  example: 'Page must be a positive number',
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
    path: `${adoptPath}/`,
    method: 'post',
    summary: 'create adoptoin',
    tags: ['Adoption'],
    security: [{ bearerAuth: [] }],
    description: `Creates a new adoption record for the authenticated user. 
        \nRequires at least one pet to be selected. 
        \nOnly authorized users can perform this action.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: adoptionSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create adoption',
        content: {
          'application/json': {
            schema: adoptResponseSchema,
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
                  example: 'At least one pet must be selected for adoption',
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
    path: `${adoptPath}/show`,
    method: 'get',
    summary: `get user's adoption`,
    tags: ['Adoption'],
    security: [{ bearerAuth: [] }],
    description: `Retrieves the authenticated user's adoption record. 
        \nThis endpoint returns the details of the user's current or past adoptions. 
        \nAuthorization is required to access this data.`,
    responses: {
      200: {
        description: 'get adoptions successfully',
        content: {
          'application/json': {
            schema: adoptResponseSchema,
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
                  example: 'Adoption not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${adoptPath}/pays`,
    method: 'get',
    summary: `show user's info pay`,
    tags: ['Adoption'],
    description: `Retrieves the authenticated user's payment information related to pet adoptions. 
        \nThis includes details such as payment total, paymoney and remaining. 
        \nAuthorization is required to access this endpoint.`,
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'get payment info successfully',
        content: {
          'application/json': {
            schema: paymentInfoSchema,
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
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'server error',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${adoptPath}/pay`,
    method: 'post',
    summary: 'pay for your pets',
    tags: ['Adoption'],
    description: `Allows an authenticated user to make a payment for their selected pet adoptions. 
        \nThe request must include valid payment details such as the amount and method. 
        \nUpon success, the endpoint returns the recorded payment information. 
        \nuthentication is required to complete the transaction.`,
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: paymentSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'get payment info successfully',
        content: {
          'application/json': {
            schema: paymentInfoSchema,
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
                  example: 'pay money must be psitive',
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
    path: `${adoptPath}/cancel`,
    method: 'post',
    summary: 'delete pets',
    tags: ['Adoption'],
    security: [{ bearerAuth: [] }],
    description: ``,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: cancelPetsSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'get payment info successfully',
        content: {
          'application/json': {
            schema: adoptResponseSchema,
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
                  example: 'At least one pet must be selected for cancelling',
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
    path: `${adoptPath}/{id}`,
    method: 'get',
    summary: 'get adopt by Id',
    tags: ['Adoption'],
    security: [{ bearerAuth: [] }],
    description: `Retrieves the adoption details for a specific adoption request by its ID. 
        \nThis endpoint requires a valid adoption ID as a path parameter. 
        \nOnly authenticated users with proper access rights can view this information. 
        \nUseful for displaying detailed information about a particular adoption transaction.`,
    request: {
      params: adoptIdParamSchema,
    },
    responses: {
      200: {
        description: 'get payment info successfully',
        content: {
          'application/json': {
            schema: adoptResponseSchema,
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
    },
  });
};
