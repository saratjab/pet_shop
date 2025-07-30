import User from '../../models/userModel';
import { findAllUsers } from '../../service/userService';

jest.mock('../../models/userModel'); //? fhis tells jest to mock User, so we can control how its methods behave inside the test
//* to isolate real mongooes

const mockUsers = [
  {
    id: '1',
    username: 'sarat',
    role: 'admin',
    email: 'sarat@gmail.com',
    isActive: true,
  },
  {
    id: '2',
    username: 'user',
    role: 'customer',
    email: 'user@gmail.com',
    isActive: true,
  },
  {
    id: '3',
    username: 'person',
    role: 'employee',
    email: 'person@gmail.com',
    isActive: false,
  },
];

const mockFunciton = jest.fn((x) => x * 2);

describe('findAllUsers Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); //? to clear all mocks history calls, results, ...
  });

  // Happy path
  it('should fetch all users', async () => {
    (User.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockUsers),
    }); //? mocks a mongoose query chain use.find -> return a fake object with
    //? skip - mocked to return the same object; so .limit can be chined
    //? limit - mocked to return a promise that resolves to mockUsers

    // mockFunciton.
    (User.countDocuments as jest.Mock).mockResolvedValueOnce(mockUsers.length);

    const result = await findAllUsers({ limit: 4, skip: 0 });

    expect(User.find).toHaveBeenCalledWith({ isActive: true });
    expect(User.countDocuments).toHaveBeenCalledWith({ isActive: true });
    expect(result.users).toEqual(mockUsers);
    expect(result.total).toBe(mockUsers.length);
  });

  // pagination check
  it('should apply skip and limit correctly', async () => {
    const skipSpy = jest.fn().mockReturnThis();
    const limitSpy = jest.fn().mockResolvedValueOnce(mockUsers);

    (User.find as jest.Mock).mockReturnValueOnce({
      skip: skipSpy,
      limit: limitSpy,
    });

    (User.countDocuments as jest.Mock).mockResolvedValueOnce(2);

    await findAllUsers({ skip: 5, limit: 3 });

    expect(skipSpy).toHaveBeenCalledWith(5);
    expect(limitSpy).toHaveBeenCalledWith(3);
  });

  // empty result
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

  // error handling
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
