import { Request, Response } from "express";

export class CompaniesController {
  //
  public async registerCompany(req: Request, res: Response): Promise<Response> {
    return res;
  }
}

export const companiesController = new CompaniesController();
