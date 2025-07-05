import { z } from 'zod';
import { adoptionSchema } from '../schemas/adoptSchema';

export type adopt = z.infer<typeof adoptionSchema>