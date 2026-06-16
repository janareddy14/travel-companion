const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes('taken') || error.message.includes('registered')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid username or password') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};
