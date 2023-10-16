import { Response } from "express";
import jwt from "jsonwebtoken";
import response from "../utils/response";
import createError from "../utils/httpError";
import { AuthRequest } from "../entities/auth.entity";
import { jwt_key } from "../config/config";
import User from "../models/users";

export const getMe = async (req: AuthRequest, res: Response) => {
  const _token = req.params.token;

  let _user: any;

  jwt.verify(_token, jwt_key, async (err: any, user: any) => {
    if (err) {
      createError(401, "Token is not valid!");
      return response({ res, status: 401, message: "Token is not valid!" });
    }
    _user = user;
  });

  let userDetails: any;
  if (_user && _user.id) {
    try {
      userDetails = await User.findOne({
        where:{
          id: _user.id
        },
        attributes: { exclude: ['password'] }, // Exclude the 'password' field
      });
      if (!userDetails) {
        createError(404, 'Invalid User Id, Please try again!');
        return response({res, status: 404, message: 'Invalid User Id, Please try again!'});
      }
     
    } catch (error) {
      createError(500, String(error));
      return response({res, status: 500, message: String(error)});
    }
    
    // eslint-disable-next-line no-unused-vars
   
      
    return response({ res, data: userDetails, message: "User fetched successfully" });
  
  }
};