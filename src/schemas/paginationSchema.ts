import { z } from 'zod';

export const paginationQuerySchema = z.object({
    page: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('1')
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Page must be a positive number'}),
    limit: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('10')
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Page must be a positive number'}),
});