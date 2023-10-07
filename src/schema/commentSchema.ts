const mongoose = require('mongoose');

const commentSchema = {
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: String,
    required: true
  },
  image_url: { type: String },
  description: {
    type: String,
    trim: true,
  },
  rich_description: {
    type: String,
    trim: true,
  },
  image_text: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
};

export default commentSchema;