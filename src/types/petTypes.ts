import { z } from 'zod';
import { filterPetsQuerySchema, updatePetSchema } from '../schemas/petSchema';

export type updatePetType = z.infer<typeof updatePetSchema>;
export type getPetsQuery = z.infer<typeof filterPetsQuerySchema>;