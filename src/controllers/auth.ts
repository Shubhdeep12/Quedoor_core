import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import response from "../utils/response";

import createError from "../utils/httpError";
import {User} from "../models/user";
import { jwt_key } from "../config/config";
import { AuthRequest } from "../entities/auth.entity";

export const register = async (req: Request, res: Response) => {
  User.sync();
  let existingUser: any;
  if (!req.body.name || !req.body.email || !req.body.password) {
    createError(500, "Please enter name, email and password.");
    return response({res, status: 500, message: "Please enter name, email and password."});
  }
  try {
    existingUser = await User.findAll({where: {
      email: req.body.email
    }});
  } catch (error) {
    createError(404, error);
    return response({res, status: 404, message: 'Not able to register, Please try again!'});
  }
 
  if (existingUser?.length) {
    createError(409, "User already exists.");
    return response({ res, status: 409, message: "User already exists." });
  }      

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    await User.create({ email: req.body.email, password: hashedPassword, name: req.body.name } as User);
  } catch (error) {
    createError(500, error);
    return response({res, status: 500, message: 'Not able to create user, Please try again!'});
  }
  return response({ res, status: 201, message: "User created successfully." });
};

export const logIn = async (req: Request, res: Response) => {
  User.sync();
  let user: any;
  if (!req.body.email || !req.body.password) {
    createError(500, "Please enter email and password.");
    return response({res, status: 500, message: "Please enter email and password."});
  }
  try {
    const users = await User.findAll({
      where: {
        email: req.body.email
      }
    });

    if (users?.length === 0) {
      createError(404, "User not found, Please try again!");
      return response({ res, status: 404, message: "User not found, Please try again!" });
    }  
    user = users[0].dataValues;
  } catch (error) {
    createError(404, error);
    return response({ res, status: 404, message: 'Not able to login, please try again!' });
  }   

  const checkPassword = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!checkPassword) {
    createError(400, "Wrong password or username, Please try again!");
    return response({
      res,
      status: 400,
      message: "Wrong password or username, Please try again!",
    });
  }

  const token = jwt.sign({ id: user.id }, jwt_key, { expiresIn: '365d' });

  // eslint-disable-next-line no-unused-vars
  const { password, ...others } = user;
  return response({
    res,
    message: "User logged in successfully.",
    data: {...others, access_token: token},
  });

 
};

//TODO: Blacklist tokens
export const logOut = (req: AuthRequest, res: Response) => {
  response({
    res,
    message: "User has been logged out",
  });
};
