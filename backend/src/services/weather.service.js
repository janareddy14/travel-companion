const fetch = require('node-fetch');
const config = require('../config');

exports.getWeather = async (city) => {
  if (!config.openweather.apiKey) {
    return getMockWeather(city);
  }

  try {
    const url = `${config.openweather.apiUrl}/weather?q=${encodeURIComponent(city)}&appid=${config.openweather.apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      return getMockWeather(city);
    }
    return await response.json();
  } catch (error) {
    return getMockWeather(city);
  }
};

exports.getForecast = async (city) => {
  if (!config.openweather.apiKey) {
    return getMockForecast(city);
  }

  try {
    const url = `${config.openweather.apiUrl}/forecast?q=${encodeURIComponent(city)}&appid=${config.openweather.apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      return getMockForecast(city);
    }
    return await response.json();
  } catch (error) {
    return getMockForecast(city);
  }
};

function getMockWeather(city) {
  return {
    name: city,
    main: { temp: 25, humidity: 60, feels_like: 27 },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    wind: { speed: 3.5 },
    mock: true
  };
}

function getMockForecast(city) {
  return {
    city: { name: city },
    list: [
      {
        dt_txt: new Date(Date.now() + 86400000).toISOString(),
        main: { temp: 26 },
        weather: [{ description: 'few clouds', icon: '02d' }]
      },
      {
        dt_txt: new Date(Date.now() + 172800000).toISOString(),
        main: { temp: 24 },
        weather: [{ description: 'scattered clouds', icon: '03d' }]
      }
    ],
    mock: true
  };
}
