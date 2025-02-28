const express = require('express');

const authController = require('../controllers/auth.controllers');
// const loginLimiter = require('../middlewares/errorHandler');

const routes = express.Router();

routes.post('/auth', authController.login);
routes.get('/auth/refresh', authController.refresh);
routes.post('/auth/logout', authController.logout);

module.exports = routes;
