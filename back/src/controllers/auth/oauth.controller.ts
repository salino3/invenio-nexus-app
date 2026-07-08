import { Response } from "express";
import jwt from "jsonwebtoken";
import {
  COOKIES_NAME,
  SECRET_KEY,
  FRONTEND_DEV_PORT,
  FRONTEND_PROD_PORT,
} from "../../constants";
import { AuthRequest } from "../../middlewares/auth-middleware";

export class OAuthController {
  public async googleCallback(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.redirect(
          `${
            process.env.NODE_ENV === "production"
              ? FRONTEND_PROD_PORT
              : FRONTEND_DEV_PORT
          }/login?error=oauth_failed`,
        );
        return;
      }

      const token = jwt.sign(user, SECRET_KEY as string, {
        expiresIn: "1h",
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: new Date(Date.now() + 3600 * 1000),
      };

      res.cookie(COOKIES_NAME as string, token, cookieOptions);

      // Redirect to frontend
      res.redirect(
        process.env.NODE_ENV === "production"
          ? (FRONTEND_PROD_PORT as string)
          : (`${FRONTEND_DEV_PORT}/dashboard` as string),
      );
    } catch (error) {
      console.error("OAuth Callback Error:", error);
      res.redirect(
        `${
          process.env.NODE_ENV === "production"
            ? FRONTEND_PROD_PORT
            : FRONTEND_DEV_PORT
        }/login?error=server_error`,
      );
    }
  }
}

export const oauthController = new OAuthController();
