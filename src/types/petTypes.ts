import { z } from 'zod';
import { filterPetsQueryAndPaginationSchema, updatePetSchema } from '../schemas/petSchema';

export type updatePetType = z.infer<typeof updatePetSchema>;
export type getPetsQuery = z.infer<typeof filterPetsQueryAndPaginationSchema>;