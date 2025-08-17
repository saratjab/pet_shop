import { registerSchema, updateUserSchema } from '../schemas/userSchema';
import { z } from 'zod';

export type registerUserType = z.infer<typeof registerSchema>;
export type userType = z.infer<typeof updateUserSchema>;
export type updateUserType = z.infer<typeof updateUserSchema>;
