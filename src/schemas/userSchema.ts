import { z } from 'zod';

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

export const loginSchema = z.object({
    username: z.string(objError).toLowerCase().nonempty(),
    password: z.string(objError),
})

export const updateUserSchema = registerSchema.partial();

export const userIdSchema = z.object({
    id: z.string().length(24, 'Invalid MongoDB ObjectId')
});

export const usernameSchema = z.object({
    username: z.string(),
});
