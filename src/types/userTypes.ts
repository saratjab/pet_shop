import { updateUserSchema } from "../schemas/userSchema";
import { z } from 'zod';

export type updateType = z.infer<typeof updateUserSchema>;