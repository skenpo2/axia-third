const express = require('express');
const routes = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

routes.post('/register', createUser);
routes.get('/api/users', getAllUsers);
routes.get('/api/user/:id', getSingleUser);
routes.patch('/api/user/', verifyJWT, updateUser);
routes.delete('/api/user/', verifyJWT, deleteUser);

module.exports = routes;
