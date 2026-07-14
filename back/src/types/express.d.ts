import { AccountCookie } from "../interfaces/account.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccountCookie;
    }
  }
}
