import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Account } from "../models/account.model";
import { utilitiesApp } from "../utils/utilities-app";
import { query } from "../db";
import {
  AccountCookie,
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

      const newAccount: Account | null =
        await Account.createAccount(accountInput);

      if (!newAccount) {
        return res.status(409).json({
          error: "This email address is already active on another account.",
        });
      }

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

  public async updateAccount(req: Request, res: Response): Promise<Response> {
    const { id } = (req.user || {}) as AccountCookie;
    const { name, email, age } = req.body;

    if (!id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing account ID" });
    }

    try {
      // 1. Single combined query: retrieves current data and validates email collision
      const { currentUser, isEmailTaken } =
        await Account.checkAccountAndEmailAvailability(id, email);

      if (!currentUser) {
        return res
          .status(404)
          .json({ message: "Account not found or inactive" });
      }

      if (email && email !== currentUser.email && isEmailTaken) {
        return res
          .status(400)
          .json({ message: "Email is already in use by another account" });
      }

      // 2. Dynamically build UPDATE clause
      const setClauses: string[] = [];
      const valuesToUpdate: Partial<Account>[] = [];
      let paramCount = 1;

      if (name !== undefined && name !== currentUser.name) {
        setClauses.push(`name = $${paramCount}`);
        valuesToUpdate.push(name);
        paramCount++;
      }

      if (email !== undefined && email !== currentUser.email) {
        setClauses.push(`email = $${paramCount}`);
        valuesToUpdate.push(email);
        paramCount++;
      }

      if (age !== undefined && age !== currentUser.age) {
        setClauses.push(`age = $${paramCount}`);
        valuesToUpdate.push(age);
        paramCount++;
      }

      if (setClauses.length === 0) {
        return res.status(400).json({
          message: "No changes detected or no valid fields provided for update",
        });
      }

      // Append ID parameter for the WHERE clause
      valuesToUpdate.push(id as Partial<Account>);

      // 3. Execute update
      const result = await Account.updateAccount(
        setClauses,
        paramCount,
        valuesToUpdate,
      );

      if (result.rows && result.rows.length > 0) {
        return res.status(200).json({
          message: "Account updated successfully",
          user: result.rows[0],
        });
      }

      return res.status(404).json({ message: "Account update failed" });
    } catch (error) {
      console.error("Error updating account:", error);
      return res.status(500).json({ message: "Error updating account" });
    }
  }

  public async acSoftDeleteAccount(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { id } = (req.user || {}) as AccountCookie;

    if (id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing account ID" });
    }

    const { accountId } = req.params;

    if (!accountId) {
      return res
        .status(400)
        .json({ message: "Missing or invalid company account ID" });
    }

    try {
      
      const deactivatedAccount: boolean = false;
    } catch (error) {
            console.error("Error executing acSoftDeleteAccount endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during deleting account" });
    }
    }

     
  }
}

export const accountController = new AccountController();
