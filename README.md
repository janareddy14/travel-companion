# 🌍 Travel Companion – Smart Travel Planning Platform

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
| Frontend | HTML5, CSS3, JavaScript, TailwindCSS CDN |
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
│   ├── index.html          # Home page
│   ├── destinations.html   # All destinations
│   ├── destination-detail.html
│   ├── trip-planner.html
│   ├── companions.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html      # User dashboard
│   ├── admin.html          # Admin panel
│   ├── css/style.css
│   └── js/                 # 10 JS modules
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The server starts at `http://localhost:8080` with an H2 in-memory database.

### 2. Open the Frontend

Open `frontend/index.html` in your browser, or serve it with:

```bash
cd frontend
npx serve .
```

### 3. Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `traveler` | `password` |

## 🔌 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Destinations (public GET)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/destinations` | List all |
| GET | `/api/destinations/{id}` | Get by ID |
| GET | `/api/destinations/search?query=` | Search |

### Trips (authenticated)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/trips` | My trips |
| POST | `/api/trips` | Create trip |
| DELETE | `/api/trips/{id}` | Delete trip |

### Weather (public)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/weather/{city}` | Current weather |

### Admin (ADMIN role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/users` | All users |
| DELETE | `/api/admin/users/{id}` | Delete user |

## ⚙️ Configuration

### OpenWeather API
Get a free key at [openweathermap.org](https://openweathermap.org/api) and set it in `application.properties`:
```properties
openweather.api.key=YOUR_KEY_HERE
```

### MySQL (Production)
Uncomment the MySQL config in `application.properties` and update credentials.

## 🚢 Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repo on [Render](https://render.com) or [Railway](https://railway.app)
3. Set build command: `cd backend && mvn clean package -DskipTests`
4. Set start command: `java -jar backend/target/travel-companion-1.0.0.jar`
5. Add environment variables for MySQL and JWT secret

### Frontend (Netlify/Vercel)
1. Deploy the `frontend/` folder
2. Update `API_BASE` in `js/api.js` to your backend URL

---

Built with ❤️ by Travel Companion
