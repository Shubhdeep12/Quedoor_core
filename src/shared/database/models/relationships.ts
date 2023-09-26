// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   userId: String, // Reference to the User who created the post
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references for likes
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Array of Comment references
//   // ... other post-related fields
// });

// const Post = mongoose.model('Post', postSchema);

// module.exports = Post;