import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.string()
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Page must be a positive number'})
        .optional(),
    limit: z.string()
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Page must be a positive number'})
        .optional(),
});