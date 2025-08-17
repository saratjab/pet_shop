import { Response, Request } from 'express';
import { handleError } from '../utils/handleErrors';
import { formatUserResponse } from '../utils/format';
import { generateRefreshToken, generateToken } from '../utils/jwt';
import {
  saveUser,
  findAllUsers,
  findUserById,
  findUserByUsername,
  verifyPassword,
  update,
} from '../service/userService';
import { pagination } from '../types/paginationTypes';
import logger from '../config/logger';
import { errorType } from '../types/errorType';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info('User registration started');
    logger.debug(`Incoming user data: ${JSON.stringify(req.body)}`);

    const newUser = req.body;
    const savedUser = await saveUser(newUser);

    logger.info(`User registered successfully: ${savedUser._id}`);
    res.status(201).json(formatUserResponse(savedUser));
  } catch (err: unknown) {
    logger.error(`Registration failed: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    logger.info(`Login attempt for username: ${username}`);
    const user = await findUserByUsername(username);
    await verifyPassword(password, user);

    const token: string = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    logger.info(`Login successful for username: ${username}`);

    res.status(200).json({
      token,
      refreshToken,
      user: formatUserResponse(user),
    });
  } catch (err: unknown) {
    logger.error(
      `Login failed for username: ${req.body?.username} - ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const registerEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info('User registration started');
    logger.debug(`Incoming user data: ${JSON.stringify(req.body)}`);

    const newEmp = req.body;
    const savedEmp = await saveUser(newEmp);

    logger.info(`User registered successfully: ${savedEmp._id}`);
    res.status(201).json(formatUserResponse(savedEmp));
  } catch (err: unknown) {
    logger.error(`Registration failed: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.status(400).json(errors);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as unknown as pagination;
    const skip = (query.page! - 1) * query.limit;
    logger.debug(`Fetching users | page: ${query.page}, limit: ${query.limit}`);

    const { users, total } = await findAllUsers({
      limit: query.limit,
      skip,
    });

    if (users.length === 0) {
      logger.info('No users found');
      res.status(200).json({ message: 'No users found' });
    } else {
      logger.info(`Fetched ${users.length} users`);
      res.status(200).json({
        data: users.map((user) => formatUserResponse(user)),
        pagination: {
          total,
          page: query.page,
          limit: query.limit,
          pages: Math.ceil(total / query.limit),
        },
      });
    }
  } catch (err: unknown) {
    logger.error(`Error fetching users: ${(err as errorType).message}`);
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    logger.debug(`Fetching user by ID: ${id}`);

    const user = await findUserById(id);
    logger.info(`User found: ${user.username}`);
    res.status(200).json(formatUserResponse(user));
  } catch (err: unknown) {
    logger.warn(`User not found with ID: ${req.params.id}`);
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const username = req.params.username;
    logger.debug(`Fetching user by username: ${username}`);

    const user = await findUserByUsername(username);
    logger.info(`User found: ${username}`);
    res.status(200).json(formatUserResponse(user));
  } catch (err: unknown) {
    logger.warn(`User not found: ${req.params.username}`);
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const updateUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedData = req.body;
    const id = req.user!.id;

    logger.debug(`User [${id}] requested profile update`);
    const user = await findUserById(id);

    const updatedUser = await update(user, updatedData);

    logger.info(`User [${id}] profile updated successfully`);
    res.status(200).json(formatUserResponse(updatedUser));
  } catch (err: unknown) {
    logger.error(
      `Failed to update user [${req.user?.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};

export const updateByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedData = req.body;
    const username = req.params.username;

    logger.debug(`Admin is updating user [${username}]`);
    const user = await findUserByUsername(username);

    const updatedUser = await update(user, updatedData);

    logger.info(`Admin successfully updated user [${username}]`);
    res.status(200).json(formatUserResponse(updatedUser));
  } catch (err: unknown) {
    logger.error(
      `Admin failed to update user [${req.params.username}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(500).json(errors);
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.user!.id;

    logger.debug(`User [${id}] requested account deletion`);
    const user = await findUserById(id);
    user.isActive = false;
    await saveUser(user);

    logger.info(`User [${user.username}] account deleted (soft delete)`);
    res.status(200).json({ message: `${user.username} has been deleted` });
  } catch (err: unknown) {
    logger.error(
      `Error deleting user account [${req.user?.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    logger.debug(`Admin requested deletion of user by ID [${id}]`);
    const user = await findUserById(id);
    user.isActive = false;
    await saveUser(user);

    logger.info(`User [${user.username}] deleted by ID [${id}]`);
    res.status(200).json({ message: `${user.username} has been deleted` });
  } catch (err: unknown) {
    logger.error(
      `Error deleting user by ID [${req.params.id}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};

export const deleteUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const username = req.params.username;

    logger.debug(`Admin requested deletion of user [${username}]`);
    const user = await findUserByUsername(username);
    user.isActive = false;
    await saveUser(user);

    logger.info(`User [${username}] deleted`);
    res.status(200).json({ message: `${user.username} have been deleted` });
  } catch (err: unknown) {
    logger.error(
      `Error deleting user [${req.params.username}]: ${(err as errorType).message}`
    );
    const errors = handleError(err as errorType);
    res.status(404).json(errors);
  }
};
