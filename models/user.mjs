import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  email: String,
  avatarUrl: String,
  accessToken: String,
  subscriptions: [String]
});

export const User = mongoose.model('User', userSchema);
