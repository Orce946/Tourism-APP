# Tourism App - Project Structure

## Overview
Bangladesh Tourism Application with place-based search, weather forecasting, and route navigation.

## Directory Structure

```
tourism app/
├── frontend/                 # Frontend files (HTML, CSS, JS)
│   ├── ui.html              # Main application page
│   ├── division.html        # Division detail page
│   ├── login.html           # Login/Sign up page
│   ├── admin.html           # Admin panel
│   ├── script.js            # Main application logic
│   ├── auth.js              # Authentication logic
│   ├── admin.js             # Admin functionality
│   ├── style.css            # Stylesheet
│   ├── destinations.json    # Destinations and spots data
│   └── images/              # Image assets (JPEG files)
│
├── backend/                 # Backend Node.js server
│   ├── src/
│   │   ├── server.js        # Express server entry point
│   │   ├── config/
│   │   │   └── db.js        # Database configuration
│   │   ├── data/
│   │   │   └── users.js     # User data
│   │   ├── middleware/
│   │   │   └── auth.js      # Authentication middleware
│   │   ├── repositories/
│   │   │   └── usersRepository.js  # Database queries
│   │   └── routes/
│   │       ├── auth.js      # Authentication routes
│   │       ├── public.js    # Public routes
│   │       └── admin.js     # Admin routes
│   ├── sql/
│   │   └── schema.sql       # Database schema
│   ├── scripts/
│   │   └── seed-admins.js   # Database seeding
│   ├── package.json         # Node dependencies
│   └── README.md            # Backend documentation
│
├── .gitignore               # Git ignore rules
└── README.md                # Main documentation
```

## Features

### Frontend
- **Place-wise Search**: Search tourist spots by name, location, or division
- **Budget Filtering**: Filter spots by budget range (Low, Medium, High)
- **Weather Forecasting**: Real-time weather data with 7-day forecast
- **Google Maps Integration**: View locations and get directions
- **Geolocation**: Find optimal routes from current location to destinations
- **Route Planning**: Integrated routing to Google Maps for navigation

### Backend
- User authentication and registration
- Admin panel for content management
- RESTful API for frontend communication
- MySQL database for data persistence

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Open-Meteo API (Weather)
- Google Maps API (Routing & Navigation)
- Geolocation API (User Location)

### Backend
- Node.js
- Express.js
- MySQL
- Bcrypt (Password hashing)
- JWT (Authentication)

## Getting Started

### Frontend
```bash
cd frontend
# Open ui.html in a web browser
```

### Backend
```bash
cd backend
npm install
npm start
```

## Important Notes

**Work Directory**: Always use `/Users/punam/Desktop/varsity/3-2/Lab/SDP/tourism app` as the main project directory.

**Avoid**: The `/Users/punam/Downloads/tourism app` folder is for backup/reference only and should not be used for active development.

## Recent Updates
- Added weather forecasting with daily forecasts
- Integrated Google Maps for location viewing
- Implemented geolocation-based routing
- Spot-based search functionality
- Route finding from current location to tourist spots
