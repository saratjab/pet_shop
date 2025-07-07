import { z } from 'zod';
import { paginationQuerySchema } from "../schemas/paginationSchema";

export type pagination = z.infer<typeof paginationQuerySchema>;