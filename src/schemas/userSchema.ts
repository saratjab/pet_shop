import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { paginationSchema } from './paginationSchema';

extendZodWithOpenApi(z);

const userRoles = z.enum(['admin', 'employee', 'customer']);
const objError = { required_error: "field is required" }

export const registerSchema = z.object({
    username: z.string(objError)
        .toLowerCase()
        .nonempty('must be at least 1 character')
        .openapi({ 
            example: 'sarat123',
            description: 'a unique nonempty username'
        }),
    password: z.string(objError)
        .min(8, 'must be at least 8 characters')
        .max(32, 'must be at most 32 characters')
        .openapi({ 
            format: 'password', 
            example: 'strongPassword',
            description: 'a strong password at least 8 char and at most 32 char'
        }),
    confirmPassword: z.string(objError)
        .min(8, 'must be at least 8 characters')
        .max(32, 'must be at most 32 characters')
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
    address: z.string(objError)
        .optional()
        .openapi({ 
            example: 'Hebron, Palestine',
            description: 'address not required'
         }),
    isActive: z.boolean()
        .optional()
        .openapi({ example: true }),
}).strict('Unexpected failed found');
//! registerSchema becomes a ZodEffects type (a wrapped schema), not a base ZodObject anymore — and .extend() only works on ZodObject.

export const registerCustomerSchema = registerSchema.extend({
    role: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('customer')
        .refine(val => val === 'customer', { message: 'must be customer' })
        .openapi({ 
            example: 'customer',
            description: 'your role in the system'
        }),
}).refine(data => data.confirmPassword === data.password, { 
    message: 'do not match passwrod',
    path: ['confirmPassword'],
}).openapi('RegisterCustomer');

export const registerEmployeeSchema = registerSchema.extend({
    role: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('employee')
        .refine(val => val === 'employee', { message: 'must be employee' })
        .openapi({ 
            example: 'employee',
            description: 'your role in the system'
        }),
}).refine(data => data.confirmPassword === data.password, {
    message: 'do not match password',
    path: ['confirmPassword'],
}).openapi('RegisterEmployee');

export const userResponseSchema = z.object({
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
}).openapi('UserResponse');

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
    user: userResponseSchema,
});

export const updateUserSchema = registerSchema.partial().openapi('UpdateUser');

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
}).openapi('IDParam');

export const usernameParamSchema  = z.object({
    username: z.string(objError)
        .nonempty('username must be at least 1 character')
        .openapi({
            example: 'user123',
            description: `user's username`
        }),
}).openapi('UsernameParam');

export const paginatedUsersResponseSchema = z.object({
    data: z.array(userResponseSchema),
    pagination: paginationSchema,
}).openapi('PaginatedUsersResponse')