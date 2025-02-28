const User = require('../models/user.model');
const Post = require('../models/post.model');

// Get all posts
const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate('creatorID', 'name email');
  res.status(200).json(posts);
};

//  Get a single post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('creatorID', 'name email');
  if (!post) throw new Error('Post not found');
  res.status(200).json(post);
};

//  Create a new post
const createPost = async (req, res) => {
  const { title, text, image } = req.body;
  const creatorID = req.id; // Extracted from verifyJWT middleware

  if (!title || !text || !image) throw new Error('All fields are required');

  const post = await Post.create({ title, text, image, creatorID });

  //Add post ID to user's posts array
  await User.findByIdAndUpdate(creatorID, { $push: { posts: post._id } });

  res.status(201).json(post);
};

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, text, image } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, text, image },
    { new: true, runValidators: true }
  );

  if (!updatedPost) throw new Error('Post not found');

  res.status(200).json(updatedPost);
};

//Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) throw new Error('Post not found');

  // Remove post reference from user's posts array
  await User.findByIdAndUpdate(deletedPost.creator, { $pull: { posts: id } });

  res.status(200).json({ message: 'Post deleted successfully' });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
