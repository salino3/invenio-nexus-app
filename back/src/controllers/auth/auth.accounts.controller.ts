import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Account } from "../../models/account.model";
import { COOKIES_NAME, SECRET_KEY } from "../../constants";
import { AccountCookie } from "../../interfaces/account.interface";

const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

      // Shallow copy for avoid problems with JSON serialization in 'return'
      const token = jwt.sign({ ...user }, SECRET_KEY as string, {
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

  public async logoutAccount(req: Request, res: Response): Promise<Response> {
    res.clearCookie(COOKIES_NAME as string, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", //  'lax' the same configuration
    });

    return res.status(200).json({ message: "Logout successful" });
  }

  //
  public async refreshToken(req: Request, res: Response): Promise<Response> {
    const token = req.cookies[COOKIES_NAME as string];

    if (!token) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    try {
      // 1. Verify token
      const decodedToken = jwt.verify(token, SECRET_KEY as string) as any;

      // Remove 'iat' and 'exp' from decoded so jwt.sign creates new ones
      const { iat, exp, ...userData } = decodedToken;

      // 2. Create new token
      const newToken = jwt.sign(userData, SECRET_KEY as string, {
        expiresIn: "1h",
      });

      // 3. Overwrite the old cookie with the new token
      res.cookie(COOKIES_NAME as string, newToken, {
        httpOnly: true, // cookie cannot be accessed via document.cookie
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in prod
        sameSite: "lax" as const, // Protects against CSRF
        expires: new Date(Date.now() + 3600 * 1000),
      });

      return res
        .status(200)
        .json({ message: "Token refreshed", user: userData });
    } catch (err) {
      return res
        .status(403)
        .json({ error: "Refresh token expired or invalid" });
    }
  }

  //
  public async getMe(req: Request, res: Response): Promise<Response> {
    try {
      let token = req.cookies[COOKIES_NAME as string];

      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]; // Get the string after "Bearer ", for mobile usually
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      // const decodedUser = jwt.decode(token) as AccountCookie;
      const decodedUser = jwt.verify(
        token,
        SECRET_KEY as string,
      ) as AccountCookie;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: decodedUser,
        token,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }
}

export const authController = new AuthController();
