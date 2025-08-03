import { buildUserData } from '../builder/userBuilder';
import User from '../../models/userModel';

export const buildUser = async (overrides = {}) => {
  const user = buildUserData(overrides);
  const createUser = await User.create(user);
  return createUser;
};
