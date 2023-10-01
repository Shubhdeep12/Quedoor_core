import postSchema from "../../../shared/schema/postSchema";

const mongoose = require('mongoose');

const _postSchema = new mongoose.Schema(postSchema);

const Post = mongoose.model('Post', _postSchema);

export default Post;
