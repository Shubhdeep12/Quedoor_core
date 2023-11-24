"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const postSchema = {
    userId: {
        type: String,
        required: true,
        trim: true,
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
    reactions: [{ type: String, }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
};
exports.default = postSchema;
//# sourceMappingURL=postSchema.js.map