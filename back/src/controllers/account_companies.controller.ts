import { Request, Response } from "express";
import { AccountCookie } from "../interfaces/account.interface";
import { AccountCompany } from "../models/account_company.model";
import { AccountCompanyAddRole } from "../interfaces/account_companies.interface";

export class AccountCompaniesController {
  //
  async addRoleCompany(req: Request, res: Response): Promise<Response> {
    const requesterId = (req.user || {}) as AccountCookie; // ID utente loggato
    const { target_account_id, uuid, role, permission = "member" } = req.body;

    if (!requesterId?.id || !target_account_id || !uuid || !role) {
      return res
        .status(400)
        .json({ error: "All required parameters must be provided." });
    }

    if (requesterId === target_account_id && permission !== "owner") {
      return res.status(403).json({
        error: "FORBIDDEN: You here cannot demote yourself from owner.",
      });
    }

    const data: AccountCompanyAddRole = {
      account_id: target_account_id,
      permission,
      requesterId: requesterId.id,
      uuid,
      role,
    };

    try {
      const result = await AccountCompany.addCompanyRole(data);

      if (!result.success) {
        return res.status(403).json({ error: result.reason });
      }

      return res
        .status(200)
        .json({ message: "User successfully added to company." });
    } catch (error: unknown) {
      console.error("Error executing addRoleCompany endpoint:", error);
      return res
        .status(500)
        .json({ error: "Internal server error during update" });
    }
  }

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
