import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Account } from "../models/account.model";
import {
  RegistretionAccountDB,
  RegistretionAccountInput,
} from "../interfaces/account.interface";

export class AuthController {
  //
  public async registerAccount(req: Request, res: Response): Promise<Response> {
    try {
      const account: RegistretionAccountInput = req.body;

      const requiredFields = Object.entries(account).reduce(
        (
          acc: string[],
          [key, value]: [key: string, value: keyof RegistretionAccountInput],
        ) => {
          if (!value || (typeof value === "string" && !value.trim())) {
            acc.push(key === "confirmPassword" ? "Confirm password" : key);
          }

          return acc;
        },
        [],
      );

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string, index: number) =>
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
          error: "Password and Confirmed password does not match",
        });
      }

      // 2. Business rule validation: Check email duplication via model static method
      const existingUser = await Account.findActiveByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: "This email address is already active on another account.",
        });
      }

      // Security: Hash password before database persistence
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 4. Input preparation
      const accountInput: RegistretionAccountDB = {
        name,
        email,
        password: passwordHash,
        age: age,
      };

      const newAccount = await Account.createAccount(accountInput);

      return res.status(201).json({
        message: "Account registered successfully.",
        user: {
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          role_user: newAccount.role_user,
        },
      });
    } catch (error: unknown) {
      console.error("Critical error inside AuthController.register:", error);
      return res.status(500).json({
        error:
          "An internal server error occurred while processing your registration.",
      });
    }
  }

  //
  public async getAllAccounts(req: Request, res: Response): Promise<Response> {
    try {
      const accounts = await Account.retrieveAllAccounts();

      return res.status(200).json(accounts);
    } catch (error: unknown) {
      console.error("Critical error inside AuthController.register:", error);
      return res.status(500).json({
        error:
          "An internal server error occurred while processing your registration.",
      });
    }
  }
}

export const authController = new AuthController();
