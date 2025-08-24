import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { paginationQuerySchema } from '../schemas/paginationSchema';
import {
  loginSchema,
  loginResponseSchema,
  registerCustomerSchema,
  userResponseSchema,
  registerEmployeeSchema,
  paginatedUsersResponseSchema,
  updateUserSchema,
  usernameParamSchema,
  userIdParamSchema,
  logoutSchema,
} from '../schemas/userSchema';

// ToDo: 1- separate auth from users 2- change error messages 3- use more zod in controllers
//! description for response
const userPath = '/api/users';

export const registerUserDocs = (registry: OpenAPIRegistry) => {
  registry.register('LoginInput', loginSchema);
  registry.register('LoginResponse', loginResponseSchema);
  registry.register('RegisterCustomer', registerCustomerSchema);
  registry.register('UserResponse', userResponseSchema);
  registry.register('RegisterEmployee', registerEmployeeSchema);
  registry.register('Pagination', paginationQuerySchema);
  registry.register('PaginatedUsersResponse', paginatedUsersResponseSchema);
  registry.register('UpdateUser', updateUserSchema);
  registry.register('UsernameParam', usernameParamSchema);
  registry.register('IDParam', userIdParamSchema);
  registry.register('Logout', logoutSchema);

  registry.registerPath({
    path: `${userPath}/register`,
    method: 'post',
    summary: 'Register a new customer',
    tags: ['Auth'],
    description: `Creates a new user account with the role of 'customer'. 
        \nThe request must include a username, email, password, and confirmPassword.  
        \nOptional fields like address and isActive can also be included. 
        \nPassword and confirmPassword must match. 
        \nThe API will respond with the created user's public information (without password).`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: registerCustomerSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User successfully registered',
        content: {
          'application/json': {
            schema: userResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request like ZodError',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: "Passwrod doesn't match",
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
                  example: 'Error saving user',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/login`,
    method: 'post',
    summary: 'Login a user and receive tokens',
    tags: ['Auth'],
    description: `This endpoint authenticates a user by verifying their username and password.
        \nIf the credentials are valid, it returns a JWT access token and a refresh token,
        \nalong with the user's public information.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: loginResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid credentials or validation errors',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid username or password',
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/refresh-token`,
    method: 'post',
    summary: 'refresh access token by refresh token',
    tags: ['Auth'],
    description: `Accepts a valid refresh token from headers and issues a new access token.
        \nThis endpoint is used to maintain a user's session without requiring them to log in again.
        \nIf the refresh token is invalid or missing, it will return a 401 Unauthorized error.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: logoutSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'refresh token is valid then generate new access token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  example: 'new access Token',
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
                  example: 'Refresh token missing or invalid',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/logout`,
    method: 'post',
    summary: 'logout user',
    tags: ['Auth'],
    description: `Logs out the current user by blacklisting the refresh token.
        \nThis ensures the token cannot be reused to gain access to the system again.
        \nA valid refresh token must be provided, typically in the request's cookies or local storage.`,
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: logoutSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'logout successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Logged out successfully',
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
                message: {
                  type: 'string',
                  example: 'Unauthorized: Token is blacklisted or missing',
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
    path: `${userPath}/employees`,
    method: 'post',
    summary: 'Register a new employee',
    tags: ['Auth'],
    description: '',
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: registerEmployeeSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User successfully registered',
        content: {
          'application/json': {
            schema: userResponseSchema,
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
                  example: 'username is required',
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
    path: `${userPath}/`,
    method: 'get',
    summary: 'get all active users',
    tags: ['Users'],
    description: `Retrieves a paginated list of all active users in the system.
        \nSupports optional query parameters for page number and limit.
        \nThe response includes user information such as username, email, role, and address,
        \nalong with pagination metadata (total users, current page, page size, and total pages)`,
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      query: paginationQuerySchema,
    },
    responses: {
      200: {
        description: 'Get users successfully',
        content: {
          'application/json': {
            schema: paginatedUsersResponseSchema,
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
    path: `${userPath}/alter`,
    method: 'patch',
    summary: 'update user data',
    tags: ['Users'],
    description: `Updates user information for the currently authenticated user. 
        \nSupports partial updates — only the fields provided in the request body will be changed.
        \nTypical updatable fields include username, email, address, and isActive. 
        \nRequires a valid JWT token for authentication.`,
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: updateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update user successfully',
        content: {
          'application/json': {
            schema: userResponseSchema,
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
                  example: 'username must be at least 1 character',
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
                  example: 'User not found',
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
    path: `${userPath}/role/{username}`,
    method: 'patch',
    summary: "update role by admin using users's username",
    tags: ['Users'],
    description: `Allows an admin to update the role of a specific user using their username.
        \nThe new role must be one of the allowed roles (e.g., admin, employee, or customer).
        \nThis endpoint requires authentication and is restricted to admin users only.
        \nThe server will respond with the updated user information if successful.`,
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      params: usernameParamSchema,
    },
    responses: {
      200: {
        description: 'Update user successfully',
        content: {
          'application/json': {
            schema: userResponseSchema,
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
                  example: 'username must be at least 1 character',
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
    path: `${userPath}/username/{username}`,
    method: 'get',
    summary: "Get a user's public profile by their username",
    tags: ['Users'],
    description: `Retrieves public profile data of a user by their unique username.
        \nThis endpoint is typically used to display user information in public or semi-public contexts.  
        \nAuthentication is required, but any authenticated user can access this endpoint.
        \nReturns the user's public data such as username, email, role, and address.`,
    security: [{ bearerAuth: [] }],
    request: {
      params: usernameParamSchema,
    },
    responses: {
      200: {
        description: 'get user successfully',
        content: {
          'application/json': {
            schema: userResponseSchema,
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
                  example: 'username must be at least 1 character',
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/{id}`,
    method: 'get',
    summary: 'get user by id',
    tags: ['Users'],
    description: `Fetches a user's data using their unique MongoDB ObjectId.
        \nThis endpoint is intended for admin users or systems that need to retrieve user information by ID.  
        \nIt requires authentication and proper authorization (e.g., admin-only access).
        \nReturns the user's public profile info if the ID is valid and authorized.`,
    security: [{ bearerAuth: [] }],
    request: {
      params: userIdParamSchema,
    },
    responses: {
      200: {
        description: 'get user successfully',
        content: {
          'application/json': {
            schema: userResponseSchema,
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/me`,
    method: 'patch',
    summary: "Delete the authenticated user's account",
    tags: ['Users'],
    description: `Allows an authenticated user to delete their own account.
        \nThis operation is irreversible and will remove all user data from the system.
        \nThe user must be logged in with a valid access token.`,
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'deleting the account successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'user123 has been deleted',
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/{id}`,
    method: 'delete',
    summary: "Delete user's account by admin using id",
    tags: ['Users'],
    description: `Allows an administrator to permanently delete a user's account using their MongoDB ObjectId.
        \nThis action is irreversible and can only be performed by users with the 'admin' role.
        \nReturns a success message upon deletion or an appropriate error if the user doesn't exist or the request is unauthorized.`,
    security: [{ bearerAuth: [] }],
    request: {
      params: userIdParamSchema,
    },
    responses: {
      200: {
        description: 'deleting the account successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'user123 has been deleted',
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });

  registry.registerPath({
    path: `${userPath}/username/{username}`,
    method: 'delete',
    summary: "Delete user's account by admin using username",
    tags: ['Users'],
    description: `Allows an administrator to permanently delete a user's account using their username.
        \nThis action is irreversible and can only be performed by users with the 'admin' role.
        \nReturns a success message upon deletion or an appropriate error if the user doesn't exist or the request is unauthorized.`,
    security: [{ bearerAuth: [] }],
    request: {
      params: usernameParamSchema,
    },
    responses: {
      200: {
        description: 'deleting the account successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'user123 has been deleted',
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
                  example: 'username must be at least 1 character',
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
                  example: 'User not found',
                },
              },
            },
          },
        },
      },
    },
  });
};
