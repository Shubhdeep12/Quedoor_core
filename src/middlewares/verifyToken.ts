import jwt from "jsonwebtoken";
import createError from "../utils/httpError";
import * as dotenv from "dotenv";
import { Response } from "express";
import { jwt_key } from "../config/config";
import { AuthRequest } from "../entities/auth.entity";
import response from "../utils/response";

dotenv.config();

const verifyToken = (req: AuthRequest, res: Response, next: Function) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      createError(401, "You are not authenticated!");
      return response({res, status:401, message: "You are not authenticated"});
    }

    jwt.verify(token, jwt_key, async (err: any, user: any) => {
      if (err) {
        createError(401, "Token is not valid!");
        return response({res, status:401, message: "Token is not valid!"});
      }
      console.log({user});
      req.user = user;
      next();
    });
  } catch (err) {
    createError(403, "Authentication failed!");
    return response({res, status:401, message: "Authentication failed!"});
  }
};

export default verifyToken;
// export const verifyToken = (req: AuthRequest, res: Response, next: Function) => {
//   try {
//     verifyToken(req, res, () => {
//       if (req.user?.id === req.params.userId) {
//         next();
//       } else {
//         return next(createError(403, "You are not authorized!"));
//       }
//     });
//   } catch (err) {
//     return next(createError(403, "Authentication failed!"));
//   }
// };
