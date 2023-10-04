import commentSchema from "../schema/commentSchema";

const mongoose = require('mongoose');

const _commentSchema = new mongoose.Schema(commentSchema);

const Comment = mongoose.model('Comment', _commentSchema);

export default Comment;