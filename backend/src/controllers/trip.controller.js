const tripService = require('../services/trip.service');

exports.getMyTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user._id);
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.user._id, req.body);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    res.json(trip);
  } catch (error) {
    if (error.message === 'Trip not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Trip not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
