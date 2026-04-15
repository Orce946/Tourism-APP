# 🌍 Ghuri-Phiri: Smart Tourist Guide & Budget Planner for Bangladesh

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

> **Ghuri-Phiri** (ঘুরি ফিরি) means "wandering around" in Bengali. A comprehensive web application that helps travelers discover, plan, and budget their trips across Bangladesh with real-time weather alerts and smart destination recommendations.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Overview

**Ghuri-Phiri** is a one-stop platform for travel information across Bangladesh. It provides:

- **Centralized Information**: Comprehensive database of tourist spots across all divisions
- **Smart Discovery**: Advanced filtering by category, budget, and preferences
- **Budget Planning**: Dynamic cost estimation for transportation, food, and accommodation
- **Real-Time Weather**: Live weather alerts and conditions for chosen destinations
- **Geospatial Integration**: Google Maps integration for location viewing
- **Admin Management**: Secure dashboard for content and pricing management

---

## ✨ Features

### 🎯 User Features

- **🏠 Home Page**: Browse all divisions with trending destinations
- **🔍 Smart Search**: Search by division, destination name, or keyword
- **💰 Budget Filters**: Filter destinations by budget range (Low, Medium, High)
- **📍 Division Details**: Explore attractions, costs, and accommodations per division
- **🌤️ Weather Widget**: Real-time weather conditions and alerts
- **💵 Cost Estimator**: Automatic trip cost calculation
- **⭐ Bookmarks**: Save favorite destinations for later
- **📅 Travel Planner**: Create and manage multi-day trip itineraries

### 🛠️ Admin Features

- **📝 CMS**: Add, edit, or delete tourist destinations
- **💲 Price Management**: Update costs based on season and demand
- **📊 Analytics Dashboard**: View popular destinations and user statistics
- **📝 Audit Logs**: Track all administrative actions

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with Tailwind CSS
- **JavaScript (ES6+)** - Dynamic functionality

### Backend (Coming Soon)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **RESTful API** - Clean API architecture

### Database
- **MySQL 8.0+** - Relational database
- **JSON fields** - Flexible data storage
- **Proper indexing** - Performance optimization

### Tools & Deployment
- **Git/GitHub** - Version control
- **VS Code** - Development environment
- **Live Server** - Local development
- **Vercel/Firebase** - Deployment (recommended)

---

## 📁 Project Structure

```
Tourism-APP/
├── frontend/                           # Frontend pages
│   ├── home/                          # Landing page
│   │   └── index.html
│   ├── divisions/                     # Division details template
│   │   └── division.html
│   ├── barisal/                       # Individual division pages
│   ├── chittagong/
│   ├── dhaka/
│   ├── khulna/
│   ├── mymensingh/
│   ├── rajshahi/
│   ├── rangpur/
│   └── sylhet/
│
├── backend/                            # Backend API (Node.js)
│   ├── routes/                        # API routes
│   ├── controllers/                   # Business logic
│   ├── models/                        # Data models
│   └── middleware/                    # Custom middleware
│
├── database/                           # Database files
│   └── database.sql                   # MySQL schema & initial data
│
├── data/                               # Static data files
│   └── destinations.json              # Destination information
│
├── assets/                             # Static assets
│   ├── css/
│   │   └── style.css                 # Main stylesheet
│   ├── js/
│   │   └── script.js                 # Main JavaScript
│   └── images/                        # All image assets
│
├── DATABASE_SCHEMA.md                  # ER diagram & schema docs
├── PROJECT_STRUCTURE.md                # Architecture guide
└── README.md                           # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Git** - Version control
- **Node.js** (v14+) - Backend runtime
- **MySQL** (v8.0+) - Database
- **Python 3** - Local server (for development)
- **Modern Web Browser** - Chrome, Firefox, Safari, Edge

### Step 1: Clone the Repository

```bash
git clone https://github.com/Orce946/Tourism-APP.git
cd Tourism-APP
```

### Step 2: Install Dependencies (Backend - Coming Soon)

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ghuri_phiri
PORT=3000
NODE_ENV=development
```

### Step 4: Setup Database

```bash
# Create database and tables
mysql -u root -p < database/database.sql

# Or manually:
mysql -u root -p
CREATE DATABASE ghuri_phiri;
USE ghuri_phiri;
SOURCE database/database.sql;
```

---

## 📱 Running the Application

### Option 1: Local Development (Frontend Only)

```bash
# Navigate to project root
cd /path/to/Tourism-APP

# Start Python HTTP server
python3 -m http.server 8000

# Open in browser
http://localhost:8000/frontend/home/
```

### Option 2: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `frontend/home/index.html`
3. Select "Open with Live Server"

### Option 3: Backend Development (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:3000
```

---

## 🗄️ Database Setup

### Import Schema

```bash
mysql -u root -p ghuri_phiri < database/database.sql
```

### Database Tables

15 tables with proper relationships:

| Table | Purpose |
|-------|---------|
| DIVISIONS | Administrative regions |
| DESTINATIONS | Tourist attractions |
| CATEGORIES | Destination types |
| ACCOMMODATION | Hotels & lodging |
| COST_TIERS | Seasonal pricing |
| WEATHER_DATA | Real-time conditions |
| USERS | User accounts |
| BOOKMARKS | Saved destinations |
| TRAVEL_PLANS | User itineraries |
| ADMIN_USERS | Admin accounts |

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete details.

---

## 🔌 API Endpoints (Coming Soon)

### Divisions
- `GET /api/divisions` - Get all divisions
- `GET /api/divisions/:id` - Get division details
- `POST /api/divisions` - Create division (Admin)
- `PUT /api/divisions/:id` - Update division (Admin)
- `DELETE /api/divisions/:id` - Delete division (Admin)

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/search?category=beach&budget=low` - Filter destinations
- `GET /api/destinations/:id` - Get destination details
- `POST /api/destinations` - Create destination (Admin)

### Weather
- `GET /api/weather/:destinationId` - Get current weather

### Users
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/users/:id/bookmarks` - Get user bookmarks
- `POST /api/users/:id/bookmarks` - Add bookmark

---

## 📊 Key Features Implementation

### Smart Filtering
- Filter by budget range (Low: <500, Medium: 500-1500, High: >1500)
- Filter by destination type (Beach, Hill, Heritage, etc.)
- Sort by name, cheapest cost, or number of spots

### Cost Estimation
- Transportation costs
- Accommodation rates
- Food expenses
- Seasonal pricing variations

### Weather Integration
- Real-time temperature
- Weather conditions (Sunny, Rainy, Cloudy)
- Weather alerts (Heat, Rain, Storm)
- Humidity and wind speed

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes before submitting PR
- Update documentation as needed

---

## 🐛 Known Issues & Limitations

### Current Version (v1.0)
- Frontend only - Backend API in development
- Static JSON data - Real database integration coming
- No user authentication yet
- No real weather API integration (placeholder data)
- No Google Maps integration (URL-only)

### Planned Features
- ✅ Backend REST API
- ✅ User authentication & profiles
- ✅ Real weather data integration
- ✅ Google Maps embedded
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Payment gateway integration

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

- **Punam** - Lead Developer
- Project started: **April 15, 2026**

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Orce946/Tourism-APP/issues)
- **Email**: [Your Email]
- **Website**: [Your Website]

---

## 🙏 Acknowledgments

- Bangladesh tourism information sources
- Community contributors
- Open source libraries and tools
- All travelers who inspired this project

---

## 📚 Additional Resources

- [Database Schema Documentation](DATABASE_SCHEMA.md)
- [Project Architecture Guide](PROJECT_STRUCTURE.md)
- [Travel in Bangladesh](https://www.visitbangladesh.gov.bd/)

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Frontend website structure
- ✅ Database schema design
- 🔄 Initial GitHub repository

### Phase 2
- 📅 Backend API development
- 📅 User authentication
- 📅 Database integration

### Phase 3
- 📅 Advanced features
- 📅 Performance optimization
- 📅 Mobile app development

### Phase 4
- 📅 Production deployment
- 📅 Scaling & maintenance
- 📅 Real-time features

---

<div align="center">

### Made with ❤️ for Bangladesh Tourism

**Happy Exploring! 🌏✈️**

[⭐ Star us on GitHub](https://github.com/Orce946/Tourism-APP) | [🐛 Report Issues](https://github.com/Orce946/Tourism-APP/issues) | [💡 Share Ideas](https://github.com/Orce946/Tourism-APP/discussions)

</div>
