import { z } from 'zod';
import { filterPetsQuerySchema, filterQuery, fromToQuerySchema, updatePetSchema } from '../schemas/petSchema';

export type updatePetType = z.infer<typeof updatePetSchema>;
// export type queryFromTo = z.infer<typeof fromToQuerySchema>;
// export type query = z.infer<typeof filterPetsQuerySchema>;
export type Query = z.infer<typeof filterQuery>;