import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerCustomerSchema, loginSchema, registerResponseSchema } from "./schemas/userSchema";

export const registry = new OpenAPIRegistry();

registry.register('LoginInput', loginSchema);
registry.register('RegisterCustomer', registerCustomerSchema);
registry.register('RegisterResponse', registerResponseSchema);

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
            description: 'Validation error',
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
            // content: {
            //     "application/json": {
            //         schema: 'loginResponse'
            //     }
            // }
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