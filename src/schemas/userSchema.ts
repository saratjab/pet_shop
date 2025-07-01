import { literal, z } from 'zod';

const userRoles = z.enum(['admin', 'employee', 'customer']);
const objError = { required_error: "This field is required" }

export const registerSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty(),
    password: z.string(objError).min(8, 'Password must be at least 8 characters').max(32),
    email: z.string(objError).email('Invalid email'),
    role: userRoles,
    address: z.string().optional(),
    isActive: z.boolean().optional(),
})

export const registerCustomerSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty('username must be at least 1 character'),
    password: z.string(objError).min(8, 'Password must be at least 8 characters').max(32, 'Password must be at most 32 characters'),
    email: z.string(objError).email('Invalid email'),
    role: z.string().refine(val => val === 'customer', { message: 'role must be customer' }).optional(),
    address: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
})

export const registerEmployeeSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty('username must be at least 1 character'),
    password: z.string(objError).min(8, 'Password must be at least 8 characters').max(32, 'Password must be at most 32 characters'),
    email: z.string(objError).email('Invalid email'),
    role: z.string().refine(val => val === 'employee', { message: 'role must be employee' }).optional(),
    address: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
})

export const loginSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty('username must be at least 1 character'),
    password: z.string(objError),
})

export const updateUserSchema = registerSchema.partial();

export const userIdParamSchema  = z.object({
    id: z.string(objError).length(24, 'Invalid MongoDB ObjectId'),
})

export const usernamedParamSchema  = z.object({
    username: z.string(objError).nonempty('username must be at least 1 character'),
})