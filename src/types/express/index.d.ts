import type { IUser } from '../models/userModel';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
