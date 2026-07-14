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
    // 1. Retrieve account ID directly from authenticated user session
    const { id } = (req.user || {}) as AccountCookie;
    const { name, email, age } = req.body;

    if (!id) {
      return res
        .status(401)
        .send({ message: "Unauthorized: Missing account ID" });
    }

    try {
      // 2. Fetch current user data from database to compare changes
      const { rows: existingUser } = await query(
        `SELECT id, name, email, age FROM accounts WHERE id = $1 AND is_active = true`,
        [id],
      );

      if (!existingUser || existingUser.length === 0) {
        return res.status(404).send({ message: "Account not found" });
      }

      const currentUser = existingUser[0];

      // 3. If email is being updated, check if it's already used by ANOTHER active user
      if (email && email !== currentUser.email) {
        const isDuplicateEmail: boolean = await Account.checkEmailActiveInUse(
          email,
          id,
        );

        if (isDuplicateEmail) {
          return res
            .status(400)
            .send({ message: "Email is already in use by another account" });
        }
      }

      // 4. Dynamically build the UPDATE SET clause
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

      // 5. Return early if no fields were modified
      if (setClauses.length === 0) {
        return res.status(400).send({
          message: "No changes detected or no valid fields provided for update",
        });
      }

      // Append ID parameter for the WHERE clause
      valuesToUpdate.push(id as Partial<Account>);

      const result = await Account.updateAccount(
        setClauses,
        paramCount,
        valuesToUpdate,
      );

      if (result.rows && result.rows.length > 0) {
        return res.status(200).send({
          message: "Account updated successfully",
          user: result.rows[0],
        });
      } else {
        return res.status(404).send({ message: "Account update failed" });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      return res.status(500).send({ message: "Error updating account" });
    }
  }
}

export const accountController = new AccountController();
