const adminService = require('../services/admin.service');
const destinationService = require('../services/destination.service');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Cannot delete admin user') {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await adminService.getAllTrips();
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

exports.addDestination = async (req, res, next) => {
  try {
    const destination = await destinationService.create(req.body);
    res.status(201).json(destination);
  } catch (error) {
    next(error);
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const destination = await destinationService.update(req.params.id, req.body);
    res.json(destination);
  } catch (error) {
    if (error.message === 'Destination not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    await destinationService.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Destination not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
