import User from '../../models/userModel';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  it('should create and save a valid user', async () => {
    const user = await User.create({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
      isActive: true,
    });

    expect(user).toBeDefined();
    expect(user.username).toBe('sarat');
    expect(user.role).toBe('admin');
    expect(user.password).not.toBe('12345678');
    const hashed = await bcrypt.compare('12345678', user.password);
    expect(hashed).toBe(true);
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('should throw validation error if username or email is missing', async () => {
    const user = new User({
      role: 'admin',
      password: '12345678',
      address: 'Hebron',
      isActive: true,
    });

    let error;
    try {
      await user.save();
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should throw validation error for invalid email format', async () => {
    const user = new User({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'saratcom',
      address: 'Hebron',
      isActive: true,
    });

    let error;
    try {
      await user.save();
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should throw duplicate key error if username or email is reused', async () => {
    const user = await User.create({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
      isActive: true,
    });

    const duplicateUser = new User({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
      isActive: true,
    });

    let error;
    try {
      await duplicateUser.save();
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  it('should hash the password before saving the user', async () => {
    const user = await User.create({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
      isActive: true,
    });

    expect(user.password).not.toBe('12345678');
    const hashed = await bcrypt.compare('12345678', user.password);
    expect(hashed).toBe(true);
  });

  it('should set default value isActive to true', async () => {
    const user = await User.create({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
    });

    expect(user.isActive).toBe(true);
  });

  it('should throw validation errors if required fields are missing', async () => {
    let error;
    try {
      await User.create({});
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.role).toBeDefined();
    expect(error.errors.password).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should throw error for password shorter than minimum length', async () => {
    const user = new User({
      username: 'sarat',
      role: 'admin',
      password: '12345',
      email: 'sarat@gmail.com',
      address: 'Hebron',
    });
    let error;
    try {
      await user.save();
    } catch (err: any) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should not re-hash password if password field is unchanged', async () => {
    const user = await User.create({
      username: 'sarat',
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
    });

    const originalPassword = user.password;

    user.username = 'username';
    user.save();

    expect(user.password).toBe(originalPassword);
  });

  it('should store the username in lowercase', async () => {
    const name = 'SARAT';
    const user = await User.create({
      username: name,
      role: 'admin',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
    });

    expect(user.username).toBe(name.toLowerCase());
  });

  it('should throw validation error for invalid role', async () => {
    const user = new User({
      username: 'sarat',
      role: 'user',
      password: '12345678',
      email: 'sarat@gmail.com',
      address: 'Hebron',
    });

    let error;
    try {
      await user.save();
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.role).toBeDefined();
  });

});
