import type { z } from 'zod';

import type { registerSchema, updateUserSchema } from '../schemas/userSchema';

export type mockUser = {
  _id?: string;
  username: string;
  role: 'admin' | 'customer' | 'employee';
  password: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  save?: () => Promise<mockUser>; // mock save method
};
export type registerUserType = z.infer<typeof registerSchema>;
export type userType = z.infer<typeof updateUserSchema>;
export type updateUserType = z.infer<typeof updateUserSchema>;
