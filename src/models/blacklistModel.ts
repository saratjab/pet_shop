import mongoose from 'mongoose';

export interface IBlacklist extends Document {
  token: string;
  expiresAt: string;
}

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<IBlacklist>('Blacklist', blacklistSchema);
