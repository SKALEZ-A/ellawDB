const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  referralCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(4).toString('hex'),
  },
  inviterCode: {
    type: String,
    required: false,
  },
  referralBalance: {
    type: Number,
    default: 0,
  },
  gameBalance: {
    type: Number,
    default: 0,
  },
  invitedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  score: {
    type: Number,
    default: 0,
  },
});

// Model
module.exports = mongoose.model('User', userSchema);
