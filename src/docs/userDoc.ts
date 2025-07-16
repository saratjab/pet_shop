import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { loginSchema, loginResponseSchema, registerCustomerSchema, registerResponseSchema, registerEmployeeSchema } from "../schemas/userSchema";

// ToDo: 1- separate auth from users 2- change error messages 

export const registerUserDocs = (registry: OpenAPIRegistry) => {
    registry.register('LoginInput', loginSchema);
    registry.register('LoginResponse', loginResponseSchema);
    registry.register('RegisterCustomer', registerCustomerSchema);
    registry.register('RegisterResponse', registerResponseSchema);
    registry.register('RegisterEmployee', registerEmployeeSchema);

    registry.registerPath({
        path: '/api/users/register',
        method: 'post',
        summary: 'Register a new customer',
        tags: ['Users'],
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
                    "application/json": {
                        schema: registerResponseSchema
                    }
                }
            },
            400: {
                description: 'Bad Request',
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: `Passwrod doesn't match`
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    registry.registerPath({
        path: '/api/users/login',
        method: 'post',
        summary: 'Login a user and receive tokens',
        tags: ['Users'],
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
                    "application/json": {
                        schema: loginResponseSchema
                    }
                }
            },
            400: {
                description: 'Invalid credentials or validation errors',
                content: {
                    "application/json": {
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
        },
    });

    registry.registerPath({
        path: '/api/users/refresh-token',
        method: 'post',
        summary: 'refresh access token by refresh token',
        tags: ['Users'],
        description: `Accepts a valid refresh token from headers and issues a new access token.
        \nThis endpoint is used to maintain a user's session without requiring them to log in again.
        \nIf the refresh token is invalid or missing, it will return a 401 Unauthorized error.`,
        responses: {
            200: {
                description: `refresh token is valid then generate new access token`,
                content:{
                    "application/json":{
                        schema:{
                            type: 'object',
                            properties:{
                                accessToken: {
                                    type: 'string',
                                    example: 'new access Token'
                                }
                            },
                        },
                    },
                },
            },
            401: {
                description: 'Unauthorized error',
                content: {
                    "application/json":{
                        schema: {
                            type: 'object',
                            properties:{
                                accessToken: {
                                    type: 'string',
                                    example: 'Refresh token missing or invalid'
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    registry.registerPath({
        path: '/api/users/logout',
        method: 'post',
        summary: 'logout user',
        tags: ['Users'],
        description: `Logs out the current user by blacklisting the refresh token.
        \nThis ensures the token cannot be reused to gain access to the system again.
        \nA valid refresh token must be provided, typically in the request's cookies or local storage.`,
        responses:{
            200: {
                description: 'logout successfully',
                content: {
                    "application/json": {
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
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: 'Unauthorized: Token is blacklisted or missing'
                                },
                            },
                        },
                    },
                },
            },
            500: {
                description: 'Internal server error',
                content: {
                    "application/json": {
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
        path: '/api/users/employees',
        method: 'post',
        summary: 'Register a new employee',
        tags: ['Users'],
        description: ``,
        request: {
            body: {
                required: true,
                content: {
                    "application/json": {
                        schema: registerEmployeeSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'User successfully registered',
                content: {
                    "application/json": {
                        schema: registerResponseSchema
                    },
                },
            },
            400: {
                description: 'Bad request',
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                ZodError: {
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
                    "application/json":{
                        schema: {
                            type: 'object',
                            properties:{
                                accessToken: {
                                    type: 'string',
                                    example: 'Token is blacklisted'
                                },
                            },
                        },
                    },
                },
            },

            403: {
                description: 'Forbidden',
                content: {
                    "application/json": {
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
}