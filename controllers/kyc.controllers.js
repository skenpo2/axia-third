const Kyc = require('../models/kyc.model');
const User = require('../models/user.model');

// Create KYC
const createKyc = async (req, res) => {
  const { image, country } = req.body;
  const user = req.id; // Extracted from verifyJWT middleware

  if (!image || !country) throw new Error('All fields are required');

  // Ensure the user doesn't already have a KYC record
  const existingKyc = await Kyc.findOne({ user });
  if (existingKyc) throw new Error('User already has a KYC record');

  // Create KYC record
  const kyc = await Kyc.create({ image, country, user, completed: true });

  // Update user's KYC reference
  await User.findByIdAndUpdate(user, { kyc: kyc._id });

  res.status(201).json(kyc);
};

module.exports = { createKyc };
