import { updateUserSchema } from "../schemas/userSchema";
import { z } from 'zod';

export type updateUserType = z.infer<typeof updateUserSchema>;