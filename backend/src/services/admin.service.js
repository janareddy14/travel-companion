const { User, Destination, Trip } = require('../models');
const tripService = require('./trip.service');

exports.getStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalDestinations = await Destination.countDocuments();
  const totalTrips = await Trip.countDocuments();

  return {
    totalUsers,
    totalDestinations,
    totalTrips
  };
};

exports.getAllUsers = async () => {
  return await User.find({}, '-password').sort({ createdAt: -1 });
};

exports.deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role === 'ADMIN') {
    throw new Error('Cannot delete admin user');
  }
  await User.findByIdAndDelete(id);
};

exports.getAllTrips = async () => {
  return await tripService.getAllTrips();
};
