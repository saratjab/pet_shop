import type { z } from 'zod';

import type { updateUserSchema } from '../schemas/userSchema';

export type updateUserType = z.infer<typeof updateUserSchema>;
