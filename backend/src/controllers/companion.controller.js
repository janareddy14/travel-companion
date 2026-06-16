const companionService = require('../services/companion.service');

exports.getAll = async (req, res, next) => {
  try {
    const companions = await companionService.getAll();
    res.json(companions);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const destination = req.query.destination || '';
    const companions = await companionService.searchByDestination(destination);
    res.json(companions);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const companion = await companionService.create(req.user._id, req.body);
    res.status(201).json(companion);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await companionService.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Companion not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
