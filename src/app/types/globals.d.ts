import { IUser } from '../components/user';

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
