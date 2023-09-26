import { Request, Response } from "express";


// import { AuthRequest } from "../entities/auth.entity";
import createError from "../../shared/utils/httpError";
import response from "../../shared/utils/response";

import { AuthRequest } from "../entities/auth.entity";
import User from "../../shared/database/models/users";

export const getUser = async(req: Request, res: Response, next: Function) => {
  const userId = req.params?.userId;
  let result;
  try {
    result = await User.findAll({
      where:{
        id: userId
      }
    });
  } catch (error) {
    return next(createError(404, 'Please try again.'));
  }
  if (result.length === 0) {
    return next(createError(404, 'Invalid User Id! Please try again.'));
  }
  
    const { ...info } = result[0];
    return response({ res, data: info, message: "User fetched successfully" });
};

export const updateUser = async(req: AuthRequest, res: Response, next: any) => {
  const userId = req.user?.id;
  const sequelize = req.app.get('sequelize');
  if (userId !== req.params.userId) {
    return next(createError(401, "You are not authorized to update this user"));
  }
  let result:any;
  try {
    result = await User.update({
      name: req.body.name,
      city: req.body.city,
      website: req.body.website,
      profileImg: req.body.profileImg,
      coverImg: req.body.coverImg,
    }, { where: { id: userId } });
    
  } catch (error) {
   createError(500, error);
    
  }

  if (result?.affectedRows > 0)
    return response({ res, message: "User updated" });
  return createError(403, "You can only update your own profile!");
};
