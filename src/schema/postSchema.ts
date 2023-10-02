const mongoose = require('mongoose');

const postSchema = {
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  attachments: [{ type: String }],
  description: {
    type: String,
    trim: true,
  },
  rich_description: {
    type: String,
    trim: true,
  },
  imageText: {
    type: String,
    trim: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
};

export default postSchema;