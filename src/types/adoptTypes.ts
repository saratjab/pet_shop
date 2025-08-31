import type { z } from 'zod';

import type {
  adoptResponseSchema,
  adoptionSchema,
} from '../schemas/adoptSchema';

export type mockAdopt = {
  user_id: string;
  pets: string[];
  payMoney: number;
  total: number;
  status: string;
};
export type createAdopt = z.infer<typeof adoptResponseSchema>;
export type adopt = z.infer<typeof adoptionSchema>;