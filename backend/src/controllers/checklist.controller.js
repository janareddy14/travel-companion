const checklistService = require('../services/checklist.service');

exports.getByTrip = async (req, res, next) => {
  try {
    const items = await checklistService.getByTrip(req.params.tripId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const item = await checklistService.addItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

exports.toggleItem = async (req, res, next) => {
  try {
    const item = await checklistService.toggleItem(req.params.id);
    res.json(item);
  } catch (error) {
    if (error.message === 'Checklist item not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await checklistService.deleteItem(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Checklist item not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
