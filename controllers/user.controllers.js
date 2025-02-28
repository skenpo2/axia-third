const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users.length)
    return res.status(404).json({ message: 'No user available' });

  res.status(200).json({ users });
};

const getSingleUser = async (req, res) => {
  const userID = req.params.id;
  const isUser = await User.findById(userID).select('-password').lean();
  if (!isUser) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(isUser);
};

const createUser = async (req, res) => {
  const { email, password, name, age } = req.body;
  if (!email || !password || !name || !age)
    return res.status(400).json({ message: 'Please provide all details' });

  const isRegisteredUser = await User.findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean();
  if (isRegisteredUser)
    return res.status(409).json({ message: 'Email already in use' });

  const newUser = new User({ name, email, age, password });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
};

// Users can only update **their own** profile
const updateUser = async (req, res) => {
  const userId = req.id;
  const { email, name, age, password } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (email && email !== user.email) {
    const duplicate = await User.findOne({ email }).lean();
    if (duplicate)
      return res.status(409).json({ message: 'Email already in use' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, age, password },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).select('-password');

  res.status(200).json(updatedUser);
};

// Users can only delete their own account
const deleteUser = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.status(200).json({ message: 'User deleted successfully' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
