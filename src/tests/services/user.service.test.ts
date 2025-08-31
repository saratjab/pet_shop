import bcrypt from 'bcryptjs';

import logger from '../../config/logger';
import User from '../../models/userModel';
import {
  findAllUsers,
  findUserById,
  findUserByUsername,
  saveUser,
  verifyPassword,
} from '../../service/userService';
import { buildUserData } from '../builder/userBuilder';

jest.mock('../../models/userModel');
jest.mock('../../config/logger');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('findAllUsers Service', () => {
  let mockUsers: any[];
  beforeEach(async () => {
    jest.resetAllMocks();
    mockUsers = [
      buildUserData({ id: '1' }),
      buildUserData({ id: '2' }),
      buildUserData({ id: '3', isActive: false }),
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all users', async () => {
    (User.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockUsers),
    });

    (User.countDocuments as jest.Mock).mockResolvedValueOnce(mockUsers.length);

    const result = await findAllUsers({ limit: 4, skip: 0 });

    expect(User.find).toHaveBeenCalledWith({ isActive: true });
    expect(User.countDocuments).toHaveBeenCalledWith({ isActive: true });
    expect(result.users).toEqual(mockUsers);
    expect(result.total).toBe(mockUsers.length);
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching users with limit=4, skip=0`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Found ${mockUsers.length} users out of ${mockUsers.length} total active users`
    );
  });

  it('should fetch only users where isActive is true', async () => {
    const activeUsers = mockUsers.filter((u) => u.isActive !== false);
    (User.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce(activeUsers),
    });

    (User.countDocuments as jest.Mock).mockResolvedValueOnce(
      activeUsers.length
    );
    const result = await findAllUsers({ skip: 0, limit: 10 });

    expect(User.find).toHaveBeenCalledWith({ isActive: true });
    expect(result.users.every((user) => user.isActive)).toBe(true);
    expect(result.total).toBe(activeUsers.length);
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching users with limit=10, skip=0`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Found ${activeUsers.length} users out of ${activeUsers.length} total active users`
    );
  });

  it('should apply skip and limit correctly', async () => {
    const skipSpy = jest.fn().mockReturnThis();
    const limitSpy = jest.fn().mockResolvedValueOnce(mockUsers);

    (User.find as jest.Mock).mockReturnValueOnce({
      skip: skipSpy,
      limit: limitSpy,
    });

    (User.countDocuments as jest.Mock).mockResolvedValueOnce(2);

    const result = await findAllUsers({ skip: 5, limit: 3 });

    expect(skipSpy).toHaveBeenCalledWith(5);
    expect(limitSpy).toHaveBeenCalledWith(3);
    expect(result).toEqual({ users: mockUsers, total: 2 });
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching users with limit=3, skip=5`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Found ${mockUsers.length} users out of 2 total active users`
    );
  });

  it('should return empty array', async () => {
    (User.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce([]),
    });

    (User.countDocuments as jest.Mock).mockResolvedValueOnce(0);

    const result = await findAllUsers({ limit: 4, skip: 0 });

    expect(result.users).toEqual([]);
    expect(result.total).toBe(0);
    expect(logger.debug).toHaveBeenCalledWith(
      `Fetching users with limit=4, skip=0`
    );
    expect(logger.info).toHaveBeenCalledWith(
      `Found 0 users out of 0 total active users`
    );
  });

  it('should throw error if countDocuments fails (Error Handling)', async () => {
    const error = new Error('Count error');

    (User.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce(mockUsers),
    });

    (User.countDocuments as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await expect(findAllUsers({ skip: 0, limit: 10 })).rejects.toThrow(
      'Count error'
    );
    expect(logger.error).toHaveBeenCalledWith(
      `Error fetching users: ${error.message}`
    );
  });
});

describe('findUserById Service', () => {
  let mockUsers: any[];
  const mockedLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUsers = [
      buildUserData({ id: '1' }),
      buildUserData({ id: '2' }),
      buildUserData({ id: '3', isActive: false }),
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user by ID', async () => {
    (User.findOne as jest.Mock).mockReturnValue(mockUsers[0]);

    const result = await findUserById('1');

    expect(result).toBe(mockUsers[0]);
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `Looking for active user with ID: 1`
    );
    expect(mockedLogger.debug).toHaveBeenCalledWith(`User found with ID: 1`);
  });

  it('should throw Error when user not exist', async () => {
    await expect(findUserById('4')).rejects.toThrow('User not found');
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      `User not found or inactive with ID: 4`
    );
  });

  it('should throw Error when user not active', async () => {
    await expect(findUserById('3')).rejects.toThrow('User not found');
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      `User not found or inactive with ID: 3`
    );
  });
});

describe('findUserByUsername Service', () => {
  let mockUsers: any[];
  const mockedLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUsers = [
      buildUserData({ username: 'user1' }),
      buildUserData({ username: 'user2', isAcitive: false }),
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user by username', async () => {
    (User.findOne as jest.Mock).mockReturnValue(mockUsers[0]);

    const result = await findUserByUsername('user1');

    expect(result).toBe(mockUsers[0]);
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `Looking for active user with username: ${mockUsers[0].username}`
    );
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `User ${mockUsers[0].username} found`
    );
  });

  it('should throw error when user not exist', async () => {
    await expect(findUserByUsername('invalid username')).rejects.toThrow(
      'User not found'
    );
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      `User not found or inactive: invalid username`
    );
  });

  it('should throw error when user not active', async () => {
    await expect(findUserByUsername('user2')).rejects.toThrow('User not found');
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      `User not found or inactive: user2`
    );
  });
});

describe('verifyPassword Service', () => {
  let mockUsers: any[];
  const mockedLogger = logger as jest.Mocked<typeof logger>;
  beforeEach(() => {
    jest.resetAllMocks();
    mockUsers = [buildUserData({ username: 'user1', password: '12345678' })];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when the password matches the stored hash', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await verifyPassword('12345678', mockUsers[0]);

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      '12345678',
      mockUsers[0].password
    );
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `Verifying password for user: user1`
    );
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `Password verification successful for user: user1`
    );
  });

  it('should throw error when passwrod does not mtach', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(verifyPassword('1234', mockUsers[0])).rejects.toThrow(
      `Wrong Password`
    );
    expect(bcrypt.compare).toHaveBeenCalledWith('1234', mockUsers[0].password);
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      `Password mismatch for user: user1`
    );
  });
});

describe('saveUser service', () => {
  let mockUsers: any[];
  const mockedLogger = logger as jest.Mocked<typeof logger>;
  beforeEach(() => {
    jest.resetAllMocks();
    mockUsers = [buildUserData({ id: '1' })];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully save a valid user and return the saved document', async () => {
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockUsers[0]), // not allow casting directly from one unrelated type to another
    })); // save on instance not on the same model so User.save as jest.mock won't work

    const result = await saveUser(mockUsers[0]);

    expect(result).toEqual(mockUsers[0]);
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      'Saving new user to the database'
    );
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      `User saved with ID: ${mockUsers[0]._id}`
    );
  });

  it('should throw an error if saving the user fails', async () => {
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(null),
    }));

    await expect(saveUser(mockUsers[0])).rejects.toThrow('Error saving user');
    expect(mockedLogger.debug).toHaveBeenCalledWith(
      'Saving new user to the database'
    );
    expect(mockedLogger.error).toHaveBeenCalledWith('Failed to save user');
  });
});
