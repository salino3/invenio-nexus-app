import { Request, Response } from "express";
import { AccountCookie } from "../interfaces/account.interface";
import { AccountCompany } from "../models/account_company.model";

export class AccountCompaniesController {
  //
  public async updateRoleCompany(
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

    if (!uuidCompany || typeof uuidCompany !== "string") {
      return res
        .status(400)
        .json({ message: "Missing or invalid company UUID" });
    }

    const { role } = req.body;

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        message: "Missing or invalid new role for updating account role",
      });
    }

    try {
      const isUpdated: boolean = await AccountCompany.updateRoleCompanyByUUID(
        role,
        id,
        uuidCompany,
      );

      if (!isUpdated) {
        return res.status(403).json({
          message:
            "Company not found or you do not have permission to modify this role company",
        });
      }

      return res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Error executing updateRoleCompany endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during update" });
    }
  }

  //
  public async deleteRoleCompany(
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

    if (!uuidCompany || typeof uuidCompany !== "string") {
      return res
        .status(400)
        .json({ message: "Missing or invalid company UUID" });
    }

    try {
      const isDeleted: boolean = await AccountCompany.deleteRoleCompanyByUUID(
        id,
        uuidCompany,
      );

      if (!isDeleted) {
        return res.status(404).json({ message: "Role relationship not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Role removed successfully" });
    } catch (error) {
      console.error("Error executing deleteRoleCompany endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during deleting role" });
    }
  }
}

export const accountCompaniesController = new AccountCompaniesController();
