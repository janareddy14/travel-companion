const { Destination } = require('../models');

exports.getAll = async () => {
  return await Destination.find().sort({ name: 1 });
};

exports.getById = async (id) => {
  const destination = await Destination.findById(id);
  if (!destination) {
    throw new Error('Destination not found');
  }
  return destination;
};

exports.search = async (query) => {
  const regex = new RegExp(query, 'i');
  return await Destination.find({
    $or: [{ name: regex }, { country: regex }]
  });
};

exports.create = async (data) => {
  const destination = new Destination(data);
  return await destination.save();
};

exports.update = async (id, data) => {
  const destination = await Destination.findByIdAndUpdate(id, data, { new: true });
  if (!destination) {
    throw new Error('Destination not found');
  }
  return destination;
};

exports.delete = async (id) => {
  const destination = await Destination.findByIdAndDelete(id);
  if (!destination) {
    throw new Error('Destination not found');
  }
};
