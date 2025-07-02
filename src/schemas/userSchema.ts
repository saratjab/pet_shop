import { z } from 'zod';

const userRoles = z.enum(['admin', 'employee', 'customer']);
const objError = { required_error: "field is required" }

export const registerSchema = z.object({
    username: z.string(objError)
        .toLowerCase()
        .nonempty(),
    password: z.string(objError)
        .min(8, 'Password must be at least 8 characters')
        .max(32),
    confirmPassword: z.string(objError)
        .min(8, 'Password must be at least 8 characters')
        .max(32),
    email: z.string(objError)
        .email('Invalid email'),
    role: userRoles,
    address: z.string()
        .optional(),
    isActive: z.boolean()
        .optional(),
})
.strict('Unexpected field found');
//! registerSchema becomes a ZodEffects type (a wrapped schema), not a base ZodObject anymore — and .extend() only works on ZodObject.
//? .refine() -> allows us to write rules for some fileds
//? it can be applied on a single field, to validate it's value / or it can be applied to the whole object to validate mulitple fields if they have relationships
//? .strict() -> makes sure no extra fields are sent 

export const registerCustomerSchema = registerSchema.extend({
    role: z.string().refine(val => val === 'customer', { message: 'role must be customer' }).optional(),
})
.refine(data => data.confirmPassword === data.password, 
    {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }
);

export const registerEmployeeSchema = registerSchema.extend({
    role: z.string().refine(val => val === 'employee', { message: 'role must be employee' }).optional(),
}).refine(data => data.confirmPassword === data.password, 
    {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }
);

export const loginSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty('username must be at least 1 character'),
    password: z.string(objError),
});

export const updateUserSchema = registerSchema.partial();

export const userIdParamSchema  = z.object({
    id: z.string(objError).length(24, 'Invalid MongoDB ObjectId'),
});

export const usernamedParamSchema  = z.object({
    username: z.string(objError).nonempty('username must be at least 1 character'),
});