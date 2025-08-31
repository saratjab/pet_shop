import type { z } from 'zod';

import type { paginationQuerySchema } from '../schemas/paginationSchema';

export type pagination = z.infer<typeof paginationQuerySchema>;