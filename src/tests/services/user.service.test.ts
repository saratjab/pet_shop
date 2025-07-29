import mongoose from 'mongoose';
import User from '../../models/userModel';
import { findAllUsers } from '../../service/userService';

jest.mock('../../models/userModel'); //? fhis tells jest to mock User, so we can control how its methods behave inside the test
//* to isolate real mongooes

const mockUsers = [
  {
    id: new mongoose.Types.ObjectId(),
    username: 'sarat',
    role: 'admin',
    email: 'sarat@gmail.com',
  },
  {
    id: new mongoose.Types.ObjectId(),
    username: 'user',
    role: 'customer',
    email: 'user@gmail.com',
  },
  {
    id: new mongoose.Types.ObjectId(),
    username: 'person',
    role: 'employee',
    email: 'person@gmail.com',
  },
];

const mockFunciton = jest.fn((x) => x * 2);

describe('findAllUsers Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); //? to clear all mocks history calls, results, ...
  });

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
});
