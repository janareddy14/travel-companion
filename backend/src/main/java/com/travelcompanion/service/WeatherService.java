package com.travelcompanion.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> getWeather(String city) {
        String url = apiUrl + "/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            // Return mock data if API key is not configured
            return Map.of(
                "name", city,
                "main", Map.of("temp", 25.0, "humidity", 60, "feels_like", 27.0),
                "weather", java.util.List.of(Map.of("main", "Clear", "description", "clear sky", "icon", "01d")),
                "wind", Map.of("speed", 3.5),
                "mock", true
            );
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getForecast(String city) {
        String url = apiUrl + "/forecast?q=" + city + "&appid=" + apiKey + "&units=metric&cnt=5";
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            return Map.of("city", Map.of("name", city), "list", java.util.List.of(), "mock", true);
        }
    }
}
