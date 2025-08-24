import type { z } from 'zod';

import type { adoptionSchema } from '../schemas/adoptSchema';

export type createAdopt = z.infer<typeof adoptResponseSchema>;
export type adopt = z.infer<typeof adoptionSchema>;
