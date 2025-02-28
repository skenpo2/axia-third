const express = require('express');
const routes = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controllers');

routes.get('/posts', getAllPosts);
routes.get('/post/:id', getPostById);
routes.post('/post/', verifyJWT, createPost);
routes.patch('/post/:id', verifyJWT, updatePost);
routes.delete('/post/:id', verifyJWT, deletePost);

module.exports = routes;
