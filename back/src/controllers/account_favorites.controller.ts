import { Request, Response } from "express";
import { query } from "../db";
import { AccountCookie } from "../interfaces/account.interface";

class AccountFavoritesController {
  public async addFavoriteCompany(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { company_uuid } = req.body;
      const account_id = ((req.user || "") as AccountCookie).id; // Extracted from authMiddleware

      if (!account_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Missing user authentication context",
        });
      }

      if (!company_uuid || typeof company_uuid !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid or missing company_uuid parameter",
        });
      }

      // 1 single SQL query without 'ON CONFLICT DO NOTHING'
      // so Postgres triggers the unique primary key constraint if it exists
      const insertQuery = `
        INSERT INTO account_favorites (account_id, company_uuid)
        SELECT $1, c.uuid
        FROM companies c
        WHERE c.uuid = $2
        RETURNING account_id, company_uuid, created_at;
      `;

      const { rows } = await query(insertQuery, [account_id, company_uuid]);

      // If rows is empty, the SELECT subquery returned no matches (Company doesn't exist)
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Target company does not exist",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Company added to favorites successfully",
        data: rows[0],
      });
    } catch (error: unknown) {
      // Postgres error code 23505: unique_violation (Unique Primary Key constraint hit)
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505"
      ) {
        return res.status(409).json({
          success: false,
          message: "Company is already in favorites",
        });
      }

      console.error("Error in addFavoriteCompany:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error while adding favorite company",
      });
    }
  }
}

export const accountFavoritesController = new AccountFavoritesController();
