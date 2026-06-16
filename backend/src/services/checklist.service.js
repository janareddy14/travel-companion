const { Checklist } = require('../models');

exports.getByTrip = async (tripId) => {
  return await Checklist.find({ tripId });
};

exports.addItem = async (data) => {
  const item = new Checklist(data);
  return await item.save();
};

exports.toggleItem = async (id) => {
  const item = await Checklist.findById(id);
  if (!item) {
    throw new Error('Checklist item not found');
  }
  item.completed = !item.completed;
  return await item.save();
};

exports.deleteItem = async (id) => {
  const item = await Checklist.findByIdAndDelete(id);
  if (!item) {
    throw new Error('Checklist item not found');
  }
};
