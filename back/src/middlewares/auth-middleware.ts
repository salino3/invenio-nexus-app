import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIES_NAME, SECRET_KEY } from "../constants.js";
import { AccountCookie, UserRole } from "../interfaces/account.interface.js";

// Extend Express Request type to include the user data
export interface AuthRequest extends Request {
  user?: AccountCookie;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies[COOKIES_NAME as string];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Get the string after "Bearer ", for mobile usually
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied. Please login." });
  }

  try {
    // Verify the token
    const decoded: AccountCookie = jwt.verify(
      token,
      SECRET_KEY as string,
    ) as any;

    const { id, name, email, role_user, hasAdFreeAccess } = decoded;

    // Attach user data to the request object
    req.user = { id, name, email, role_user, hasAdFreeAccess };

    next();
  } catch (error) {
    res.clearCookie(COOKIES_NAME as string);
    return res
      .status(403)
      .json({ error: "Invalid or expired session. Please login again." });
  }
};

export const roleMiddleware =
  (allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies[COOKIES_NAME as string];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // Get the string after "Bearer ", for mobile usually
    }

    if (!token) {
      return res.status(401).json({ error: "Access denied. Please login." });
    }

    if (
      req.user &&
      req.user.role_user &&
      allowedRoles.includes(req.user.role_user as UserRole)
    ) {
      next();
    } else {
      return res.status(401).json({ error: "Access denied." });
    }
  };
