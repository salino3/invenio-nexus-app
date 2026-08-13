import { Request, Response } from "express";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { Account } from "../../models/account.model";
import { sendEmail } from "../../services/send-email";
import { COOKIES_NAME, FRONTEND_DEV_PORT, SECRET_KEY } from "../../constants";
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
  public async refreshToken(
    req: Request,
    res: Response,
  ): Promise<Response<{ message: "Token refreshed"; user: AccountCookie }>> {
    const token = req.cookies[COOKIES_NAME as string];

    if (!token) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    try {
      // 1. Verify token
      const decodedToken = jwt.verify(token, SECRET_KEY as string) as any;

      const freshUser = await Account.getAccountWithSubscription(
        decodedToken.id,
      );

      if (!freshUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Ensure plain object payload
      const userPayload = {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        role_user: freshUser.role_user,
        hasAdFreeAccess: freshUser.hasAdFreeAccess,
      };

      // 2. Create new token
      const newToken = jwt.sign(userPayload, SECRET_KEY as string, {
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
        .json({ message: "Token refreshed", user: userPayload });
    } catch (err) {
      console.error("Refresh token error:", err);
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

      // 1. Verify the token to extract the account ID securely
      const decodedUser = jwt.verify(
        token,
        SECRET_KEY as string,
      ) as AccountCookie;

      // 2. Fetch fresh user data & active subscription directly from PostgreSQL
      const freshUser = await Account.getAccountWithSubscription(
        decodedUser.id,
      );

      if (!freshUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 3. 🔑 RE-SIGN THE JWT WITH UPDATED USER DATA
      const newToken = jwt.sign({ ...freshUser }, SECRET_KEY as string, {
        expiresIn: "1h",
      });

      // 4. 🔑 RE-SET THE COOKIE WITH THE NEW TOKEN
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: new Date(Date.now() + 3600 * 1000),
      };

      res.cookie(COOKIES_NAME as string, newToken, cookieOptions);

      // 3. Return the updated user status
      return res.status(200).json({
        success: true,
        message: "Session fetched successfully",
        user: freshUser,
        token: newToken,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }

  //
  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      // Generate a secure random token for the email link
      const rawToken = crypto.randomBytes(32).toString("hex");

      // Hash token to store safely in DB
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const result = await Account.temporaryPassword(hashedToken, email);

      if (result.rows.length > 0) {
        const resetUrl = `${FRONTEND_DEV_PORT}/reset-password/${rawToken}`;

        const emailHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="margin-bottom: 20px;">
      <img src="cid:companyLogo" alt="Company Logo" style="max-width: 150px; height: auto;" />
    </div>
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your account.</p>
    <p>Click the button below to choose a new password. This link is valid for <strong>15 minutes</strong>:</p>
    <p style="margin: 25px 0;">
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </p>
    <p style="color: #666; font-size: 12px;">If you did not request this email, you can safely ignore it.</p>
  </div>
`;

        await sendEmail({
          to: email,
          subject: "Password Reset Request",
          html: emailHtml,
          attachments: [
            {
              filename: "logo.png",
              path: path.join(__dirname, "../../assets/web-icon.svg"),
              cid: "companyLogo",
            },
          ],
        });
      }

      // Always return success to prevent email enumeration attacks
      return res.status(200).json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  //
  public async resetPassword(req: Request, res: Response): Promise<Response> {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }

    try {
      // Hash the token received from frontend to match the database entry
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await Account.resetingPasswordToken(
        hashedPassword,
        hashedToken,
      );

      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({ error: "Password reset token is invalid or has expired." });
      }

      return res.status(200).json({
        message: "Password updated successfully. You can now log in.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const authController = new AuthController();
