package com.travelcompanion.controller;

import com.travelcompanion.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/{city}")
    public ResponseEntity<Map<String, Object>> getWeather(@PathVariable String city) {
        return ResponseEntity.ok(weatherService.getWeather(city));
    }

    @GetMapping("/{city}/forecast")
    public ResponseEntity<Map<String, Object>> getForecast(@PathVariable String city) {
        return ResponseEntity.ok(weatherService.getForecast(city));
    }
}
