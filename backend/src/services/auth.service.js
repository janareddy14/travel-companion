const { User } = require('../models');
const jwtUtils = require('../utils/jwt');

exports.register = async (username, email, password) => {
  // Check if username or email exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new Error('Username is already taken');
    }
    if (existingUser.email === email) {
      throw new Error('Email is already registered');
    }
  }

  // Create new user (password is hashed in pre-save hook)
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  // Generate JWT token
  const token = jwtUtils.generateToken(user._id, user.username, user.role);

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
  };
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const token = jwtUtils.generateToken(user._id, user.username, user.role);

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
  };
};
