import mongoose from 'mongoose';

export interface IAdopt extends Document {
  user_id: string;
  pets: string[];
  payMoney?: number;
  total?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pay extends Document {
  money: number;
  adopt_id: string;
}

const adoptSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Enter user id'],
      ref: 'User',
    },
    pets: {
      type: [mongoose.Schema.Types.ObjectId],
      required: [true, 'Enter pets'],
      ref: 'Pet',
    },
    payMoney: {
      type: Number,
      default: 0,
      min: [0, 'payMoney cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'total not calculated'],
      min: [0, 'Age cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAdopt>('Adopt', adoptSchema);
