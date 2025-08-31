import { buildUserData } from '../builder/userBuilder';
import type { IUser } from '../../models/userModel';
import User from '../../models/userModel';

export const buildUser = async (overrides = {}): Promise<IUser> => {
  const user = buildUserData(overrides);
  const createUser = await User.create(user);
  return createUser;
};