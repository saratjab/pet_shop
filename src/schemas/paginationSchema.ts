import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const paginationQuerySchema = z.object({
    page: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('1')
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Page must be a positive number'})
        .openapi({ 
            example: '3',
            description: 'page number',
        }),
    limit: z.string()
        .transform(val => (val.trim() === '' ? undefined : val))
        .optional()
        .default('10')
        .transform(val => parseInt(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Limit must be a positive number'})
        .openapi({
            example: '15',
            description: 'the maximum number of objects',
        }),
}).openapi('Pagination');

export const paginationSchema = z.object({
  total: z.number()
    .openapi({
         example: 50 
        }),
  page: z.number()
    .openapi({
         example: 3 
        }),
  limit: z.number()
    .openapi({
         example: 10 
        }),
  pages: z.number()
    .openapi({
         example: 5 
        }),
}).openapi('Pagination');