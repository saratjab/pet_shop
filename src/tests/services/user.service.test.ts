import User from '../../models/userModel';
import { findAllUsers } from '../../service/userService';
import { buildUserData } from '../builder/userBuilder';
import { buildUser } from '../helper/db';

jest.mock('../../models/userModel'); // Mocking User to avoid real MongoDB operations during tests

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
  });
});
