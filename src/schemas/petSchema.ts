import { object, z } from 'zod';

const objError = { required_error: "This field is required" }

export const registerPetSchema = z.object({
    petTag: z.string(objError).toLowerCase(),
    name: z.string(objError),
    kind: z.string(objError),
    age: z.number(objError).int().positive(),
    price: z.number(objError).positive(),
    description: z.string(objError).optional(),
    gender: z.enum(['M', 'F']),
    isAdopted: z.boolean().default(false),
});

export const updatePetSchema = registerPetSchema.partial();

export const petIdSchema = z.object({
    id: z.string().length(24, 'Invalid MongoDB ObjectId'),
});

export const petTagSchema = z.object({
    petTag: z.string(),
});
