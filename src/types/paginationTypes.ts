import { z } from 'zod';
import { paginationParamSchema } from "../schemas/paginationSchema";

export type pagination = z.infer<typeof paginationParamSchema>;