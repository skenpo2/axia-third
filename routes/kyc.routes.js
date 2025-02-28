const express = require('express');
const routes = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { createKyc } = require('../controllers/kyc.controllers');

routes.post('/user/kyc', verifyJWT, createKyc);

// routes.patch('/api/user/', verifyJWT, updateUser);

module.exports = routes;
