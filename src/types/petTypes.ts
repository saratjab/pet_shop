import { z } from 'zod';
import { filterPetsQuerySchema, updatePetSchema } from '../schemas/petSchema';

export type updatePetType = z.infer<typeof updatePetSchema>;
export type Query = z.infer<typeof filterPetsQuerySchema>;