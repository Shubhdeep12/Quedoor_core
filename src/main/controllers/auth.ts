import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import response from "../../shared/utils/response";

import createError from "../../shared/utils/httpError";
import User from "../../shared/database/models/users";

export const register = async (req: Request, res: Response, next: Function) => {
  // CHECK USER IF EXIST
  const sequelize = req.app.get('sequelize');
  let user: any;
  try {
    user = await User.findAll({where: {
      email: req.body.email
    }})
  } catch (error) {
    next(createError(404, error))
  }
 
  if (user?.length) {
    return response({ res, status: 409, message: "User already exists" });
  }      

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    await User.create({ email: req.body.email, password: hashedPassword, name: req.body.name });
  } catch (error) {
    next(createError(500, error));
  }
    
  return response({ res, status: 201, message: "User has been created" });
};

export const logIn = async (req: Request, res: Response, next: Function) => {
  const sequelize = req.app.get('sequelize');
  let user: any;
  try {
    user = await User.findAll({where: {
      email: req.body.email
    }})
  } catch (error) {
    next(createError(404, error))
  }
 
  if (user?.length === 0) {
    return response({ res, status: 404, message: "User not found." });
  }      

  const checkPassword = bcrypt.compareSync(
    req.body.password,
    user[0].password
  );

  if (!checkPassword) {
    
    return response({
      res,
      status: 400,
      message: "Wrong password or username!",
    });
  }

  const token = jwt.sign({ id: user[0].id }, process.env.JWT_KEY as string);

  const { password, ...others } = user[0];
  return response({
    res: res.cookie("accessToken", token, { httpOnly: true }),
    message: "User has been logged in",
    data: others,
  });

 
};

export const logOut = (req: Request, res: Response) => {
  response({
    res: res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    }),
    message: "User has been logged out",
  });
};
