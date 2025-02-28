const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // using comparePassword method from user schema
  const isPassword = await foundUser.comparePassword(password);
  if (!isPassword) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const accessToken = jwt.sign(
    { id: foundUser._id },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '1h',
    }
  );

  const refreshToken = jwt.sign(
    { id: foundUser._id },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '7d',
    }
  );

  res
    .status(200)
    .cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken });
};

// also get a refresh token

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(403).json({ message: 'Unauthorized' });
  }

  // when the access token expires user
  //    user can get a new access token by using the refresh token

  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: ' Forbidden' });
    }
    const foundUser = await User.findById({ _id: decoded.id });

    if (!foundUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const accessToken = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '1h' }
    );
    res.json({ accessToken });
  });
};

// logout

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.sendStatus(204);
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
  res.json({ message: ' Logged out' });
};

module.exports = { login, refresh, logout };
