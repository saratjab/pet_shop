import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  username: string;
  role: 'admin' | 'customer' | 'employee';
  password: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UUser extends mongoose.Document {
  username?: string;
  role?: 'admin' | 'customer' | 'employee';
  password?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Enter a username'],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, 'Please enter a role'],
      enum: ['admin', 'customer', 'employee'],
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
    },
    email: {
      type: String,
      required: [true, 'Enter your email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Enter a valid Email'],
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model<IUser>('User', userSchema);
