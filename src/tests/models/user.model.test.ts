import User from '../../models/userModel';
import bcrypt from 'bcryptjs';
import { buildUserData } from '../builder/userBuilder';

describe('User Model', () => {
  let userData: any;
  beforeEach(() => {
    userData = buildUserData();
  });

  it('should create and save a valid user', async () => {
    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.role).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.password).toBeDefined;
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('should throw validation error if username or email is missing', async () => {
    userData = buildUserData({ username: undefined, email: undefined });
    const user = new User(userData);

    await expect(user.save()).rejects.toMatchObject({
      errors: {
        username: expect.anything(),
        email: expect.anything(),
      },
    });
  });

  it('should throw validation error for invalid email format', async () => {
    userData = buildUserData({ email: 'sratcome' });
    const user = new User(userData);

    await expect(user.save()).rejects.toMatchObject({
      errors: {
        email: expect.anything(),
      },
    });
  });

  it('should throw duplicate key error if username or email is reused', async () => {
    await User.create(userData);
    const duplicateUser = new User(userData);

    await expect(duplicateUser.save()).rejects.toMatchObject({
      name: 'MongoServerError',
      code: 11000,
    });
  });

  it('should hash the password before saving the user', async () => {
    userData = buildUserData({ password: '12345678' });
    const user = await User.create(userData);

    expect(user.password).not.toBe('12345678');
    const hashed = await bcrypt.compare('12345678', user.password);
    expect(hashed).toBe(true);
  });

  it('should set default value isActive to true', async () => {
    userData = buildUserData({ isActive: undefined });
    const user = await User.create(userData);

    expect(user.isActive).toBe(true);
  });

  it('should throw validation errors if required fields are missing', async () => {
    await expect(User.create({})).rejects.toThrow(/validation failed/i);
  });

  it('should throw error for password shorter than minimum length', async () => {
    userData = buildUserData({ password: '12345' });
    const user = new User(userData);
    await expect(user.save()).rejects.toThrow(/validation failed/i);
  });

  it('should not re-hash password if password field is unchanged', async () => {
    const user = await User.create(userData);

    const originalPassword = user.password;

    user.username = 'username';
    await user.save();

    expect(user.password).toBe(originalPassword);
  });

  it('should store the username in lowercase', async () => {
    const name = 'SARAT';
    userData = buildUserData({ username: name });
    const user = await User.create(userData);

    expect(user.username).toBe(name.toLowerCase());
  });

  it('should throw validation error for invalid role', async () => {
    userData = buildUserData({ role: 'invalidRole' });
    const user = new User(userData);

    await expect(user.save()).rejects.toThrow(/validation failed/i);
  });
});
