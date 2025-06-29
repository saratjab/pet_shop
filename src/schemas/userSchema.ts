import { z } from 'zod';

const userRoles = z.enum(['admin', 'employee', 'customer']);
const objError = { required_error: "This field is required" }
export const registrSchema = z.object({
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