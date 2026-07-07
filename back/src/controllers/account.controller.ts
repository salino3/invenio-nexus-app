import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Account } from "../models/account.model";
import { utilitiesApp } from "../utils/utilities-app";
import {
  RegistretionAccountDB,
  RegistretionAccountInput,
} from "../interfaces/account.interface";

const { checkRequiredFields } = utilitiesApp();

export class AccountController {
  //
  public async registerAccount(req: Request, res: Response): Promise<Response> {
    try {
      const account: RegistretionAccountInput = req.body;

      const requiredFields = checkRequiredFields(account);

      if (requiredFields.length > 0) {
        return res.status(400).json({
          error: `Missing fields:${requiredFields.map(
            (item: string) => ` ${item}`,
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
        age,
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

  public async getAllAccountsActives(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const accounts = await Account.retrieveAllAccountsActives();

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

export const accountController = new AccountController();
