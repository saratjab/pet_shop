import bcrypt from 'bcryptjs';
import { HydratedDocument } from 'mongoose';

import User, { IUser } from '../models/userModel';
import { updateUserType } from '../types/userTypes';
import logger from '../config/logger';
import { errorType } from '../types/errorType';

export const findAllUsers = async (pagination: {
  limit: number;
  skip: number;
}): Promise<{ users: HydratedDocument<IUser>[]; total: number }> => {
  try {
    logger.debug(
      `Fetching users with limit=${pagination.limit}, skip=${pagination.skip}`
    );
    const [users, total] = await Promise.all([
      User.find({ isActive: true })
        .skip(pagination.skip)
        .limit(pagination.limit),
      User.countDocuments({ isActive: true }),
    ]);
    logger.info(
      `Found ${users.length} users out of ${total} total active users`
    );
    return { users, total };
  } catch (err: unknown) {
    logger.error(`Error fetching users: ${(err as errorType).message}`);
    throw err;
  }
};

export const findUserById = async (
  id: string
): Promise<HydratedDocument<IUser>> => {
  logger.debug(`Looking for active user with ID: ${id}`);
  const user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    logger.warn(`User not found or inactive with ID: ${id}`);
    throw Error('User not found');
  }
  logger.debug(`User found with ID: ${id}`);
  return user;
};

export const findUserByUsername = async (
  username: string
): Promise<HydratedDocument<IUser>> => {
  logger.debug(`Looking for active user with username: ${username}`);

  const user = await User.findOne({ username: username, isActive: true });
  if (!user) {
    logger.warn(`User not found or inactive: ${username}`);
    throw Error('User not found');
  }
  logger.debug(`User ${username} found`);
  return user;
};

export const saveUser = async (
  user: IUser
): Promise<HydratedDocument<IUser>> => {
  logger.debug('Saving new user to the database');

  const newUser = new User(user);
  const savedUser = await newUser.save();
  if (!savedUser) {
    logger.error('Failed to save user');
    throw Error('Error saving user');
  }

  logger.debug(`User saved with ID: ${savedUser._id}`);
  return savedUser;
};

export const verifyPassword = async (
  password: string,
  user: IUser
): Promise<boolean> => {
  logger.debug(`Verifying password for user: ${user.username}`);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn(`Password mismatch for user: ${user.username}`);
    throw Error('Wrong Password');
  }
  logger.debug(`Password verification successful for user: ${user.username}`);
  return isMatch;
};

export const update = async (
  user: IUser,
  UUser: updateUserType
): Promise<IUser> => {
  logger.debug(`Updating user: ${user.username}`);
  Object.assign(user, UUser);
  logger.info(`User ${user.username} updated successfully`);
  return await user.save();
};
