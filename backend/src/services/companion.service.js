const { TravelCompanion } = require('../models');

exports.getAll = async () => {
  const companions = await TravelCompanion.find().populate('userId', 'username');
  return companions.map(c => ({
    id: c._id,
    userId: c.userId?._id,
    username: c.userId?.username,
    destinationName: c.destinationName,
    travelDates: c.travelDates,
    interests: c.interests,
    bio: c.bio,
    contactInfo: c.contactInfo,
    budgetMin: c.budgetMin,
    budgetMax: c.budgetMax
  }));
};

exports.searchByDestination = async (destination) => {
  const regex = new RegExp(destination, 'i');
  const companions = await TravelCompanion.find({ destinationName: regex }).populate('userId', 'username');
  return companions.map(c => ({
    id: c._id,
    userId: c.userId?._id,
    username: c.userId?.username,
    destinationName: c.destinationName,
    travelDates: c.travelDates,
    interests: c.interests,
    bio: c.bio,
    contactInfo: c.contactInfo,
    budgetMin: c.budgetMin,
    budgetMax: c.budgetMax
  }));
};

exports.create = async (userId, data) => {
  const companion = new TravelCompanion({
    userId,
    ...data
  });
  await companion.save();
  return companion;
};

exports.delete = async (id) => {
  const companion = await TravelCompanion.findByIdAndDelete(id);
  if (!companion) {
    throw new Error('Companion not found');
  }
};
