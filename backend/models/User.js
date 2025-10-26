const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String, default: '' }, // URL to profile image
  role: { type: String, enum: ['user','moderator','admin'], default: 'user' },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
