import { User } from "./authtypes";

export {};
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
