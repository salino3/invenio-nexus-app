import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { accountFavoritesController } from "../controllers/account_favorites.controller";

const routerAccountFavorites = express.Router();

routerAccountFavorites.post(
  "/favorite-company",
  authMiddleware,
  accountFavoritesController.addFavoriteCompany,
);

routerAccountFavorites.get(
  "/favorites",
  authMiddleware,
  accountFavoritesController.getFavorites,
);

routerAccountFavorites.delete(
  "/favorites/:uuidCompany",
  authMiddleware,
  accountFavoritesController.removeFavorite,
);

export default routerAccountFavorites;
