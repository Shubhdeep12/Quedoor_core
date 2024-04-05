import { Response } from "express";
import response from "../utils/response";
import createError from "../utils/httpError";
import {Post} from "../models/post";
import { AuthRequest } from "../entities/auth.entity";
import {User} from "../models/user";
import getFollowing from "../utils/getFollowing";
import getImageText from "../utils/getImageText";
import { Op } from "sequelize";
const stringSimilarity = require('string-similarity');


export const getFilteredPosts = async (req: AuthRequest, res: Response) => {

  const image = req.file?.buffer;
  const description = req.body.description;
  let imageText = '';
  if (image) {
    imageText = await getImageText(image);
  }
  try {
    const userId = Number(req.user?.id);
    const { limit = 10, page = 1 }: any = req.query;

    const skip = (page - 1) * limit;

    const followers = await getFollowing(userId);
    const filter = {
      userId: {
        [Op.in]: [userId, ...(followers || [])]
      }
    };
    let count = 1;
    if (description?.length > 2 && imageText && imageText?.length > 2) {
      count = 2;
    }

    const posts = await Post.findAll({
      where: filter,
      raw: true
    });

    posts.sort((a: any, b: any) => {
      const valA =
        ((imageText && imageText?.length > 1 &&
          stringSimilarity.compareTwoStrings(imageText, a.imageText)) +
          (description.length > 1 &&
            stringSimilarity.compareTwoStrings(description, a.description))) /
        count;
      const valB =
        ((imageText && imageText?.length > 1 &&
          stringSimilarity.compareTwoStrings(imageText, b.imageText)) +
          (description.length > 1 &&
            stringSimilarity.compareTwoStrings(description, b.description))) /
        count;

      if (valA > valB) {
        return -1;
      } else if (valA < valB) {
        return 1;
      }
      return 0;
    });

    const sortedPosts = posts.slice(skip, skip + Number(limit));

    const totalRecords = posts.length;

    const postsWithUserInfo = [];
    for (const post of sortedPosts) {
      const user = await User.findOne({
        where: { id: post.userId },
        attributes: { exclude: ['password'] },
      });
      if (user) {

        postsWithUserInfo.push(
          {
            ...post,
            creator: user,
          },
        );
      }
    }
    const responseData = { data: postsWithUserInfo, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords) };
    response({ res, status: 200, data: responseData });
  } catch (error) {
    createError(500, String(error));
    return response({ res, status: 500, message: String(error) });
  }
};
