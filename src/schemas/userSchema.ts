import { z } from 'zod';

const userRoles = z.enum(['admin', 'employee', 'customer']);
 
export const registrSchema = z.object({
    username: z.string().toLowerCase().nonempty(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(32),
    email: z.string().email('Invalid email'),
    role: userRoles,
    address: z.string().optional(),
    isActive: z.boolean().optional(),
})

export const loginSchema = z.object({
    username: z.string().toLowerCase().nonempty(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(32),
})