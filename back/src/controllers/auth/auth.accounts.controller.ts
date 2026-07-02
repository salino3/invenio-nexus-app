import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export class AuthController {
  public async loginAccount(req: Request, res: Response): Promise<Response> {
    return res.status(200).send("ok");
  }
}
