import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerCustomerSchema, loginSchema, registerSchema } from "./schemas/userSchema";

export const registry = new OpenAPIRegistry();
registry.register('LoginInput', loginSchema);
registry.register('RegisterCustomer', registerCustomerSchema);

registry.registerPath({
  method: 'post',
  path: '/api/users/register',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created',
    },
  },
});
