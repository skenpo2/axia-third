const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      validate: {
        validator: (age) => age >= 18,
        message: 'Age must be at least 18.',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    kyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kyc',
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

// hashing  password before saving
// ensures a password in only hashed when created or modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// method to compare passwords during login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//Delete related posts & KYC when user is deleted
userSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await mongoose.model('Post').deleteMany({ creator: this._id });
    await mongoose.model('Kyc').deleteOne({ user: this._id });
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
