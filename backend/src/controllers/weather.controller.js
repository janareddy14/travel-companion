const weatherService = require('../services/weather.service');

exports.getWeather = async (req, res, next) => {
  try {
    const weather = await weatherService.getWeather(req.params.city);
    res.json(weather);
  } catch (error) {
    next(error);
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const forecast = await weatherService.getForecast(req.params.city);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
};
