import type { z } from 'zod';

import type { adoptResponseSchema, adoptionSchema } from '../schemas/adoptSchema';

export type createAdopt = z.infer<typeof adoptResponseSchema>;
export type adopt = z.infer<typeof adoptionSchema>;
