import { Response } from "express";
import response from "../utils/response";
import createError from "../utils/httpError";
import Post from "../models/posts";
import { AuthRequest } from "../entities/auth.entity";
import User from "../models/users";
import getFollowing from "../utils/getFollowing";
import getImageText from "../utils/getImageText";
const stringSimilarity = require('string-similarity');


export const getFilteredPosts = async (req: AuthRequest, res: Response) => {

  const image = req.file?.buffer;
  const description = req.body.description;
  let image_text = '';
  if (image) {
    image_text = await getImageText(image);
  } 
  const userId = req.user?.id;
  const { limit = 10, page = 1 }: any = req.query;
  try {
   
    const skip = (page - 1) * limit;

    const followers = await getFollowing(Number(userId));
    const filter = { userId: { $in: [userId, ...(followers || [])] } };
    let count = 1;
    if (description?.length > 2 && image_text && image_text?.length > 2) {
      count = 2;
    }
    
    // Fetch the posts first
    const posts = await Post.find(filter).lean().exec();
    console.log({posts});
    // Apply your custom sort logic to the posts
    posts.sort((a: any, b: any) => {
      const valA =
        ((image_text && image_text?.length > 1 &&
          stringSimilarity.compareTwoStrings(image_text, a.image_text)) +
        (description.length > 1 &&
          stringSimilarity.compareTwoStrings(description, a.description))) /
        count;
      const valB =
        ((image_text && image_text?.length > 1 &&
          stringSimilarity.compareTwoStrings(image_text, b.image_text)) +
        (description.length > 1 &&
          stringSimilarity.compareTwoStrings(description, b.description))) /
        count;

      if (valA > valB) {
        return -1; // Sort in descending order
      } else if (valA < valB) {
        return 1; // Sort in descending order
      }
      return 0;
    });

    // Apply limit and skip to the sorted data
    const sortedPosts = posts.slice(skip, skip + Number(limit));

    // Get total records count
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
    const responseData = {data: postsWithUserInfo, page: Number(page), limit: Number(limit), totalRecords: Number(totalRecords) };
    response({ res, status: 200, data: responseData });
  } catch (error) {
    createError(500, String(error));
    return response({res, status: 500, message: String(error)});
  }
};
