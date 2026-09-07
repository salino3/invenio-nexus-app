import { Request, Response } from "express";

class AccountFavoritesController {
  //
  async addFavoriteCompany(req: Request, res: Response): Promise<Response> {
    return await res;
  }
}

export const accountFavoritesController = new AccountFavoritesController();
