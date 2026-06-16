const matchingService = require('../services/matching.service');

exports.getPotentialMatches = async (req, res, next) => {
  try {
    const matches = await matchingService.getPotentialMatches(req.user._id);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    const { myCompanionId, receiverCompanionId, message } = req.body;
    const request = await matchingService.sendRequest(req.user._id, myCompanionId, receiverCompanionId, message);
    res.status(201).json(request);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already exists')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const requests = await matchingService.getRequests(req.user._id);
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await matchingService.acceptRequest(req.params.id, req.user._id);
    res.json(request);
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(403).json({ message: error.message });
    if (error.message === 'Request not found') return res.status(404).json({ message: error.message });
    next(error);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await matchingService.rejectRequest(req.params.id, req.user._id);
    res.json(request);
  } catch (error) {
    if (error.message === 'Unauthorized') return res.status(403).json({ message: error.message });
    if (error.message === 'Request not found') return res.status(404).json({ message: error.message });
    next(error);
  }
};

exports.getAcceptedMatches = async (req, res, next) => {
  try {
    const matches = await matchingService.getAcceptedMatches(req.user._id);
    res.json(matches);
  } catch (error) {
    next(error);
  }
};
