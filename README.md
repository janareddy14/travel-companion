# 🌍 Travel Companion – Smart Travel Planning Platform   ( https://travel-companion-mocha.vercel.app/ )

A full-stack travel planning web application built with **Java Spring Boot** and **HTML/CSS/JavaScript (TailwindCSS)**.

## ✨ Features

- 🔐 **JWT Authentication** – Register, Login, Logout with secure token-based auth
- 🗺️ **Destination Explorer** – Browse destinations with search & season filters
- ✈️ **Trip Planner** – Plan trips with smart cost estimates
- 👥 **Travel Companion Finder** – Find travelers heading to the same destination
- 🌤️ **Weather Forecast** – Real-time weather via OpenWeather API
- 🗺️ **Interactive Maps** – Leaflet maps with POIs (hotels, restaurants, attractions)
- ✅ **Travel Checklist** – Track your packing and preparation
- 🌙 **Dark Mode** – Toggle between light and dark themes
- 📊 **Admin Dashboard** – Manage destinations, users, and trips
- 📱 **Fully Responsive** – Mobile, tablet, and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JPA |
| Auth | JWT (jjwt 0.12.5), BCrypt |
| Database | H2 (dev), MySQL (prod) |
| Frontend | React|
| Maps | Leaflet.js |
| Weather | OpenWeather API |
| Icons | Font Awesome 6 |
| Fonts | Inter, Poppins (Google Fonts) |

## 📁 Project Structure

```
companion/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/travelcompanion/
│       ├── TravelCompanionApplication.java
│       ├── config/         # WebConfig, DataInitializer
│       ├── controller/     # REST controllers
│       ├── dto/            # Request/Response DTOs
│       ├── entity/         # JPA entities
│       ├── repository/     # Spring Data repositories
│       ├── security/       # JWT auth, Security config
│       └── service/        # Business logic
├── frontend/
    app.jsx
    destination.jsx
│   # 10 JS modules
└── README.md
```

## 🚀 Quick Start



Built with ❤️ by Travel Companion
