const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
  },
  { timestamps: true }
);

const Kyc = mongoose.model('Kyc', kycSchema);
module.exports = Kyc;
