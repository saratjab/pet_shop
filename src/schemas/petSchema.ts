import { z } from 'zod';

const objError = { required_error: "This field is required" }

export const registerPetSchema = z.object({
    petTag: z.string(objError).toLowerCase(),
    name: z.string(objError),
    kind: z.string(objError),
    age: z.number(objError).positive(),
    price: z.number(objError).positive(),
    description: z.string(objError).optional(),
    gender: z.enum(['M', 'F']),
    isAdopted: z.boolean().default(false),
});

export const updatePetSchema = registerPetSchema.partial();

export const petIdParamSchema = z.object({
    id: z.string().length(24, 'Invalid MongoDB ObjectId'),
});

export const petTagParamSchema = z.object({
    petTag: z.string(),
});

export const petIdDeleteSchema = z.object({
    id: z.array(
        z.string(objError).length(24, 'Invalid MongooDB ObjectId')
    ).nonempty('At least one ID is required'),
})

export const petTagDeleteSchema = z.object({
    petTag: z.array(
        z.string(objError)
    ).nonempty('At least one pet tag is required'),
})

export const filterPetsQuerySchema  = z.object({
    kind: z.string().optional(),
    gender: z.enum(['F', 'M']).optional(),
    age: z.string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Age must be a positive number'})
        .optional(),
    price: z.string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Price must be a positive number'})
        .optional(),
    isAdopted: z.enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
});

export const fromToQuerySchema = z.object({
    from: z.string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'from must be a positive number'})
        .optional(),
    to: z.string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, { message: 'to must be a positive number'})
        .optional(),

})