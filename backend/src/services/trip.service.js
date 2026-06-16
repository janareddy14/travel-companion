const { Trip, Checklist } = require('../models');

exports.getUserTrips = async (userId) => {
  const trips = await Trip.find({ userId }).populate('destinationId');
  return trips.map(trip => {
    return {
      id: trip._id,
      destinationId: trip.destinationId?._id,
      destinationName: trip.destinationId?.name,
      destinationCountry: trip.destinationId?.country,
      destinationImage: trip.destinationId?.imageUrl,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      travelType: trip.travelType,
      status: trip.status,
      notes: trip.notes
    };
  });
};

exports.createTrip = async (userId, data) => {
  const trip = new Trip({
    userId,
    ...data
  });
  await trip.save();
  return trip;
};

exports.updateTrip = async (id, data) => {
  const trip = await Trip.findByIdAndUpdate(id, data, { new: true });
  if (!trip) {
    throw new Error('Trip not found');
  }
  return trip;
};

exports.deleteTrip = async (id) => {
  const trip = await Trip.findByIdAndDelete(id);
  if (!trip) {
    throw new Error('Trip not found');
  }
  // Delete associated checklist items
  await Checklist.deleteMany({ tripId: id });
};

exports.getAllTrips = async () => {
  const trips = await Trip.find().populate('destinationId');
  return trips.map(trip => {
    return {
      id: trip._id,
      destinationId: trip.destinationId?._id,
      destinationName: trip.destinationId?.name,
      destinationCountry: trip.destinationId?.country,
      destinationImage: trip.destinationId?.imageUrl,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget,
      travelType: trip.travelType,
      status: trip.status,
      notes: trip.notes
    };
  });
};
