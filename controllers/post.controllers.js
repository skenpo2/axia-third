const User = require('../models/user.model');
const Post = require('../models/post.model');

// Get all posts
const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate('creator', 'name email');
  res.status(200).json(posts);
};

// Get a single post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('creator', 'name email');
  if (!post) throw new Error('Post not found');
  res.status(200).json(post);
};

// Create a new post
const createPost = async (req, res) => {
  const { title, text, image } = req.body;
  const creator = req.id; // Extracted from verifyJWT middleware

  if (!title || !text || !image) throw new Error('All fields are required');

  const post = await Post.create({ title, text, image, creator });

  // Add post ID to user's posts array
  await User.findByIdAndUpdate(creator, { $push: { posts: post._id } });

  res.status(201).json(post);
};

// Update a post (Only Creator Can Update)
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, text, image } = req.body;
  const userID = req.id; // Extracted from verifyJWT middleware

  const post = await Post.findById(id);
  if (!post) throw new Error('Post not found');

  if (post.creator.toString() !== userID) {
    return res
      .status(403)
      .json({ message: 'Unauthorized: You can only update your own posts' });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, text, image },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedPost);
};

// Delete a post (Only Creator Can Delete)
const deletePost = async (req, res) => {
  const { id } = req.params;
  const userID = req.id; // Extracted from verifyJWT middleware

  const post = await Post.findById(id);
  if (!post) throw new Error('Post not found');

  if (post.creator.toString() !== userID) {
    return res
      .status(403)
      .json({ message: 'Unauthorized: You can only delete your own posts' });
  }

  await Post.findByIdAndDelete(id);

  // Remove post reference from user's posts array
  await User.findByIdAndUpdate(post.creator, { $pull: { posts: id } });

  res.status(200).json({ message: 'Post deleted successfully' });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
