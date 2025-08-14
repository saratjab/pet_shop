import { z } from 'zod';
import { adoptionSchema, adoptResponseSchema } from '../schemas/adoptSchema';

export type createAdopt = z.infer<typeof adoptResponseSchema>;
export type adopt = z.infer<typeof adoptionSchema>;
