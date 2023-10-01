import jwt from "jsonwebtoken";
import createError from "../../shared/utils/httpError";
import * as dotenv from "dotenv";
import { Response } from "express";
import { jwt_key } from "../config/config";
import { AuthRequest } from "../../shared/entities/auth.entity";

dotenv.config();

const verifyToken = (req: AuthRequest, res: Response, next: Function) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, jwt_key, async (err: any, user: any) => {
      if (err) return next(createError(401, "Token is not valid!"));
      req.user = user;
      next();
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};

export const verifyUser = (req: AuthRequest, res: Response, next: Function) => {
  try {
    verifyToken(req, res, () => {
      if (req.user?.id === req.params.userId) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  } catch (err) {
    return next(createError(403, "Authentication failed!"));
  }
};
