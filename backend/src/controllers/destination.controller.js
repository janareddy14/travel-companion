const destinationService = require('../services/destination.service');

exports.getAll = async (req, res, next) => {
  try {
    const destinations = await destinationService.getAll();
    res.json(destinations);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const destination = await destinationService.getById(req.params.id);
    res.json(destination);
  } catch (error) {
    if (error.message === 'Destination not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const query = req.query.query || '';
    const destinations = await destinationService.search(query);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const destination = await destinationService.create(req.body);
    res.status(201).json(destination);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
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
