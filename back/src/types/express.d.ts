/// <reference types="multer" />
import { AccountCookie } from "../interfaces/account.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccountCookie;
      file?: Express.Multer.File;
      files?:
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export {};
