import { Request, Response } from "express";
import { AccountCookie } from "../interfaces/account.interface";

export class AccountCompaniesController {
  //
  public async updateRolesCompanies(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { id } = (req.user || {}) as AccountCookie;

    if (!id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing account ID" });
    }

    const { uuidCompany } = req.params;

    if (!uuidCompany) {
      return res.status(400).send("Missing company UUID");
    }

    const { role } = req.body;

    if (!role) {
      return res
        .status(401)
        .json({ message: "Missing new role for updating account role" });
    }

    try {
    } catch (error) {
      console.error("Error executing updateCompanyByUUID endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during update" });
    }

    return res;
  }
}

export const accountCompaniesController = new AccountCompaniesController();
