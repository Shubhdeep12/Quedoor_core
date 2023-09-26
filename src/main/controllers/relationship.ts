// import { Request, Response } from "express";
// import response from "../../shared/utils/response";
// import createError from "../../shared/utils/httpError";
// import { AuthRequest } from "../entities/auth.entity";
// import Relationships, { RelationshipsMap } from "../models/relationships";
// 

// export const getRelationships = async(req: Request, res: Response, next: Function) => {
  // const sequelize = req.app.get('sequelize');
//   RelationshipsMap(sequelize);
//   let result: any;
//   try {
//     result = await Relationships.findAll({
//       attributes: ['followerUserId'],
//       where: {
//         followedUserId: req.query.followedUserId,
//       },
//     })
//   } catch (error) {
//     next(createError(500, error))
//   }
  
//   return response({
//     res,
//     data: result.map(({followerUserId}: any) => followerUserId),
//     message: "Relationships fetched successfully",
//   });
// };

// export const addRelationships = async(req: AuthRequest, res: Response, next: Function) => {
//   const userId = req.user?.id;
//   let result: any;

//   try {
//     result = await Relationships.create({ followerUserId: userId, followedUserId: req.body.userId });
//   } catch (error) {
//     next(createError(500, error));
//   }
//   return response({ res, data: result, message: "Relationship added successfully" });
// };

// export const deleteRelationships = async (req: AuthRequest, res: Response, next: Function) => {
//   const userId = req.user?.id;
//   let result: any;
//   try {
//     result = await Relationships.destroy({
//       where: {
//         followerUserId: userId,
//         followedUserId: req.query.userId,
//       },
//     })
//   } catch (error) {
//     next(createError(500, error))
//   }
//   return response({
//     res,
//     data: result,
//     message: "Relationship deleted successfully",
//   });
// };
