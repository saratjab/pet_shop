import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from 'bcryptjs';


export interface IUser extends mongoose.Document {
  username: string;
  role: "admin" | "customer" | "employee";
  password: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UUser extends mongoose.Document {
  username?: string;
  role?: "admin" | "customer" | "employee";
  password?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Enter a username'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        required: [true, 'Please enter a role'],
        enum: ['admin', 'customer', 'employee']
    },
    password: {
        type: String,
        required: [true, 'Enter a password']
        // validate: {
        // validator: function (value: string): boolean {
        //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        // },
        // message:
        //     'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        // },
        // (?=.*[a-z]): at least one lowercase
        // (?=.*[A-Z]): at least one uppercase
        // (?=.*\d): at least one digit
        // (?=.*[@$!%*?&]): at least one special char
        // {8,}: at least 8 characters total
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Enter a valid Email']
    },
    address:{
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

// pre is a Mongoose middleware function "pre-save hook".
userSchema.pre<IUser>('save', async function(next): Promise<void> {
    if (!this.isModified('password')) return next();

    //? Mongoose provides the method this.isModified('fieldName') inside middleware hooks to check if a specific field (like "password") has been modified since the last save.
    //* >> true if the field was modified or set (e.g., during registration or password update) >> false if the field was untouched.

    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // if (!passwordRegex.test(this.password)) {
    //     return next(new Error('Password must be at least 6 characters long and include at least one letter and one number.'));
    // }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

export default mongoose.model<IUser>('User', userSchema);