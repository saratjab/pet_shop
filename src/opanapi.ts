import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerCustomerSchema, loginSchema } from "./schemas/userSchema";

export const registry = new OpenAPIRegistry();
registry.register('LoginInput', loginSchema);
registry.register('RegisterCustomer', registerCustomerSchema);

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
            // content: {
            //     "application/json": {
            //         schema: 'UserResponse'
            //     }
            // }
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
