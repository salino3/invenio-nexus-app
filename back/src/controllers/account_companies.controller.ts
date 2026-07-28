import { Request, Response } from "express";

export class AccountCompaniesController {
  //
  public async updateRolesCompanies(
    req: Request,
    res: Response,
  ): Promise<Response> {
    return res;
  }
}

export const accountCompaniesController = new AccountCompaniesController();
