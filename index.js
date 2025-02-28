require('dotenv').config();
require('express-async-errors'); //to catch error efficiently
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const kycRoutes = require('./routes/kyc.routes');

const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

const PORT = process.env.PORT || 3500;
const dbURL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(dbURL)
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch(() => {
    console.log('Cannot Establish Database connection');
  });
// routes
app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);
app.use(kycRoutes);

// error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(` App is listening at Port ${PORT}`);
});
