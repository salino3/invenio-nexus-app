import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Account } from "../../models/account.model";
import { COOKIES_NAME, SECRET_KEY } from "../../constants";

let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class AuthController {
  public async loginAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send("All parameters are required");
      }

      if (!regex.test(email)) {
        return res.status(405).send("Invalid Email address");
      }

      const user = await Account.loginAccount(email, password);

      const token = jwt.sign(user, SECRET_KEY as string, {
        expiresIn: "1h",
      });

      // 1. Define Cookie Options
      const cookieOptions = {
        httpOnly: true, // cookie cannot be accessed via document.cookie
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in prod
        sameSite: "lax" as const, // Protects against CSRF
        expires: new Date(Date.now() + 3600 * 1000),
      };

      res.cookie(COOKIES_NAME as string, token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
        token,
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
