import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Account } from "../../models/account.model";
import {
  COOKIES_NAME,
  SECRET_KEY,
  FRONTEND_DEV_PORT,
  FRONTEND_PROD_PORT,
} from "../../constants";
import { AuthRequest } from "../../middlewares/auth-middleware";

class OAuthController {
  public async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as AuthRequest).user;

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

      const hasAdFreeAccess: boolean =
        await Account.checkSubscriptionStatusByUser(user.id);

      const userPayload = {
        ...user,
        hasAdFreeAccess,
      };

      // 1. Generate Backend Token (for Cookie)
      const backendToken = jwt.sign(userPayload, SECRET_KEY as string, {
        expiresIn: "1h",
      });

      // 2. Generate Frontend Token (to pass to sessionStorage via URL redirect)
      const frontendToken = jwt.sign(
        { id: user.id, email: user.email, role_user: user.role_user },
        process.env.SECRET_KEY_FRONT as string,
        {
          expiresIn: "1h",
        },
      );

      // 3. Define Cookie Options for Backend Token
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: new Date(Date.now() + 3600 * 1000),
      };

      res.cookie(COOKIES_NAME as string, backendToken, cookieOptions);

      // 4. Redirect to frontend, appending the frontendToken so the client
      // can capture it from the URL query params and store it in sessionStorage
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? FRONTEND_PROD_PORT
          : `${FRONTEND_DEV_PORT}/dashboard`;

      res.redirect(`${baseUrl}?token=${frontendToken}`);
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
