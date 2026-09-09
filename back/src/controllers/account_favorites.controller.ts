import { Request, Response } from "express";
import { query } from "../db";
import { AccountCookie } from "../interfaces/account.interface";
import { AccountFavoritesResponse } from "../interfaces/account_favorites.interface";
import { AccountFavorites } from "../models/account_favorites.model";

class AccountFavoritesController {
  public async addFavoriteCompany(
    req: Request,
    res: Response,
  ): Promise<
    Response<
      string,
      Record<string, string | boolean | AccountFavoritesResponse[]>
    >
  > {
    try {
      const account_id = ((req.user || "") as AccountCookie).id; // Extracted from authMiddleware

      if (!account_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Missing user authentication context",
        });
      }

      const { company_uuid } = req.body;

      if (!company_uuid || typeof company_uuid !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid or missing company_uuid parameter",
        });
      }

      const rows: AccountFavoritesResponse[] =
        await AccountFavorites.insertFavoriteCompany(account_id, company_uuid);

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
        rows,
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

  //
  public async getFavorites(
    req: Request,
    res: Response,
  ): Promise<Response<string[] | { error: string }>> {
    try {
      const account_id = ((req.user || "") as AccountCookie).id;

      if (!account_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Missing user authentication context",
        });
      }

      const favoritesList: string[] =
        await AccountFavorites.getFavorites(account_id);

      return res.status(200).json(favoritesList);
    } catch (error: unknown) {
      console.error("Error in getFavorites:", error);
      return res.status(500).json({
        error: "Internal server error while fetching favorite companies",
      });
    }
  }

  //
  async removeFavorite(req: Request, res: Response): Promise<Response> {
    try {
      const { uuidCompany } = req.params as { uuidCompany: string };

      if (!uuidCompany) {
        return res.status(404).json({
          success: false,
          error: "Missing UUID company",
        });
      }

      const account_id = ((req.user || "") as AccountCookie).id;

      if (!account_id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Missing user authentication context",
        });
      }

      return res;
    } catch (error: unknown) {
      console.error("Error in removeFavorite:", error);
      return res.status(500).json({
        error: "Internal server error while deleting favorite company",
      });
    }
  }
}

export const accountFavoritesController = new AccountFavoritesController();
