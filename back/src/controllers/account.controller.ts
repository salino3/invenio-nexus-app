import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { query } from "../db";
import { Account } from "../models/account.model";
import {
  AccountProps,
  CreateAccountInput,
  RegistretionAccountInput,
} from "../interfaces/account.interface";

export class AuthController {
  /**
   * Route Handler: POST /api/auth/register
   * Coordinates request validation, security hashing, model invocation, and HTTP response.
   */
  public async registerAccount(req: Request, res: Response): Promise<Response> {
    try {
      const account: RegistretionAccountInput = req.body;

      const requiredFields = Object.values(account).reduce(
        (acc: string[], item: keyof RegistretionAccountInput) => {
          if (!item) {
            acc.push(item);
          }

          return acc;
        },
        [],
      );

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: RegistretionAccountInput, index: number) =>
              ` ${item}${index + 1 === requiredFields.length ? "" : ","}`,
          )} ${requiredFields.length > 1 ? "are" : "is"} required.`,
        });
      }

      const { email, name, password, confirmPassword, age } = account;

      if (account.age < 18) {
        return res.send("You must be at least 18 years old");
      }

      if (password !== confirmPassword) {
        return res.status(401).json({
          error: "Password anc Confirmed password does not match",
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
        age: age,
      };

      const newAccount = await Account.createAccount(query, accountInput);

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

export const authController = new AuthController();
