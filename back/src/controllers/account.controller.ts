import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { query } from "../db";
import { Account } from "../models/account.model";
import { CreateAccountInput } from "../interfaces/account.interface";

export class AuthController {
  /**
   * Route Handler: POST /api/auth/register
   * Coordinates request validation, security hashing, model invocation, and HTTP response.
   */
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, age } = req.body;

      // 1. Structural request validation
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Missing fields: name, email, and password are required.",
        });
      }

      // 2. Business rule validation: Check email duplication via model static method
      const existingUser = await Account.findActiveByEmail(query, email);
      if (existingUser) {
        return res.status(409).json({
          error: "This email address is already active on another account.",
        });
      }

      // 3. Security: Hash password before database persistence
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 4. Input preparation
      const accountInput: CreateAccountInput = {
        name,
        email,
        passwordHash,
        age: age ? parseInt(age, 10) : undefined,
      };

      // 5. Invoke model static method (No SQL in the controller!)
      const newAccount = await Account.createAccount(query, accountInput);

      // 6. Respond to user, removing sensitive fields if necessary
      return res.status(201).json({
        message: "Account registered successfully.",
        user: {
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          role_user: newAccount.role_user,
        },
      });
    } catch (error: any) {
      console.error("Critical error inside AuthController.register:", error);
      return res.status(500).json({
        error:
          "An internal server error occurred while processing your registration.",
      });
    }
  }
}

// Export an instance of the controller to bind directly in routes
export const authController = new AuthController();
