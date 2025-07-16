import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const userRoles = z.enum(['admin', 'employee', 'customer']);
const objError = { required_error: "field is required" }

export const registerSchema = z.object({
    username: z.string(objError)
        .toLowerCase()
        .nonempty('username must be at least 1 character')
        .openapi({ 
            example: 'sarat123',
            description: 'a unique nonempty username'
        }),
    password: z.string(objError)
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must be at most 32 characters')
        .openapi({ 
            format: 'password', 
            example: 'strongPassword',
            description: 'a strong password at least 8 char and  at most 32 char'
        }),
    confirmPassword: z.string(objError)
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must be at most 32 characters')
        .openapi({ 
            format: 'password', 
            example: 'strongPassword',
            description: 'confirm your password'
        }),
    email: z.string(objError)
        .email('Invalid email')
        .openapi({ 
            example: 'sarat@gmail.com',
            description: 'email'
        }),
    role: userRoles,
    address: z.string()
        .optional()
        .openapi({ 
            example: 'Hebron, Palestine',
            description: 'address not required'
         }),
    isActive: z.boolean()
        .optional()
        .openapi({ example: true }),
}).strict('Unexpected field found');
//! registerSchema becomes a ZodEffects type (a wrapped schema), not a base ZodObject anymore — and .extend() only works on ZodObject.

export const registerCustomerSchema = registerSchema.extend({
    role: z.string()
        .refine(val => val === 'customer', { message: 'role must be customer' })
        .optional()
        .openapi({ 
            example: 'customer',
            description: 'your role in the system'
        }),
}).refine(data => data.confirmPassword === data.password, { 
    message: 'Passwords do not match',
    path: ['confirmPassword'],
}).openapi('RegisterCustomer');

export const registerEmployeeSchema = registerSchema.extend({
    role: z.string()
        .refine(val => val === 'employee', { message: 'role must be employee' })
        .optional()
        .openapi({ 
            example: 'employee',
            description: 'your role in the system'
        }),
}).refine(data => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
}).openapi('RegisterEmployee');

export const registerResponseSchema = z.object({
    username: z.string(objError)
        .toLowerCase()
        .nonempty()
        .openapi({ 
            example: 'sarat123',
            description: 'a unique nonempty username'
        }),
    role: userRoles,
    email: z.string(objError)
        .email('Invalid email')
        .openapi({ 
            example: 'sarat@gmail.com',
            description: 'email'
        }),
    address: z.string()
        .optional()
        .openapi({ 
            example: 'Hebron, Palestine',
            description: 'address not required'
         }),
})

export const loginResponseSchema = z.object({
    token: z.string()
        .openapi({
            example: 'jwt token',
            description: 'jwt token for the user'
        }),
    refreshToken: z.string()
        .openapi({
            example: 'jwt refreshToken',
            description: 'jwt refreshToken for the user'
        }),
    user: registerResponseSchema,
});

export const updateUserSchema = registerSchema.partial();

export const loginSchema = z.object({
    username: z.string(objError)
        .toLowerCase()
        .nonempty('username must be at least 1 character')
        .openapi({ 
            example: 'sarat123',
            description: 'your username'
        }),
    password: z.string(objError)
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must be at most 32 characters')
        .openapi({ 
            example: 'strongPassword',
            description: 'your passwrod'
        }),
}).openapi('LoginInput');

export const userIdParamSchema  = z.object({
    id: z.string(objError)
        .length(24, 'Invalid MongoDB ObjectId'),
});

export const usernamedParamSchema  = z.object({
    username: z.string(objError)
        .nonempty('username must be at least 1 character'),
});