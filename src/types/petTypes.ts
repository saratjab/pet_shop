import { z } from 'zod';

import {
  filterPetsQueryAndPaginationSchema,
  registerPetSchema,
  updatePetSchema,
} from '../schemas/petSchema';

export type createPetType = z.infer<typeof registerPetSchema>;
export type updatePetType = z.infer<typeof updatePetSchema>;
export type getPetsQuery = z.infer<typeof filterPetsQueryAndPaginationSchema>;
