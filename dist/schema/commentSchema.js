"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
};
exports.default = commentSchema;
//# sourceMappingURL=commentSchema.js.map