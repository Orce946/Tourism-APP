-- ============================================================================
-- Ghuri-Phiri: Smart Tourist Guide & Budget Planner for Bangladesh
-- Database Schema SQL Script
-- ============================================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS ghuri_phiri;
USE ghuri_phiri;

-- ============================================================================
-- Table: DIVISIONS
-- Description: Administrative divisions in Bangladesh
-- ============================================================================
CREATE TABLE DIVISIONS (
    division_id INT AUTO_INCREMENT PRIMARY KEY,
    division_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    hero_image_url VARCHAR(500),
    total_spots INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_division_name (division_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: CATEGORIES
-- Description: Destination categories (Beach, Hill, Heritage, etc.)
-- ============================================================================
CREATE TABLE CATEGORIES (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: DESTINATIONS
-- Description: Tourist spots and attractions
-- ============================================================================
CREATE TABLE DESTINATIONS (
    destination_id INT AUTO_INCREMENT PRIMARY KEY,
    division_id INT NOT NULL,
    spot_name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    historical_background TEXT,
    category_type VARCHAR(50),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    map_url VARCHAR(500),
    image_gallery JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES DIVISIONS(division_id) ON DELETE CASCADE,
    INDEX idx_spot_name (spot_name),
    INDEX idx_division_id (division_id),
    INDEX idx_category_type (category_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: SPOT_CATEGORIES (Junction Table)
-- Description: Many-to-many relationship between DESTINATIONS and CATEGORIES
-- ============================================================================
CREATE TABLE SPOT_CATEGORIES (
    spot_category_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    category_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_spot_category (destination_id, category_id),
    INDEX idx_destination_id (destination_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ACCOMMODATION
-- Description: Hotels and lodging options near destinations
-- ============================================================================
CREATE TABLE ACCOMMODATION (
    accommodation_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    hotel_name VARCHAR(200) NOT NULL,
    hotel_type VARCHAR(50),
    star_rating DECIMAL(3, 2),
    price_per_night DECIMAL(10, 2),
    contact_number VARCHAR(20),
    website_url VARCHAR(500),
    address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    INDEX idx_destination_id (destination_id),
    INDEX idx_hotel_name (hotel_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: COST_TIERS
-- Description: Seasonal pricing and cost breakdown for destinations
-- ============================================================================
CREATE TABLE COST_TIERS (
    cost_tier_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    season VARCHAR(20),
    base_cost DECIMAL(10, 2),
    transport_cost DECIMAL(10, 2),
    accommodation_cost DECIMAL(10, 2),
    food_cost DECIMAL(10, 2),
    other_cost DECIMAL(10, 2),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    INDEX idx_destination_id (destination_id),
    INDEX idx_destination_season (destination_id, season),
    INDEX idx_valid_period (valid_from, valid_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: WEATHER_DATA
-- Description: Real-time weather information for destinations
-- ============================================================================
CREATE TABLE WEATHER_DATA (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    temperature DECIMAL(5, 2),
    humidity INT,
    weather_condition VARCHAR(50),
    weather_alert VARCHAR(50),
    wind_speed DECIMAL(6, 2),
    wind_direction VARCHAR(20),
    precipitation DECIMAL(6, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    forecast_until TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    INDEX idx_destination_id (destination_id),
    INDEX idx_recorded_at (recorded_at),
    INDEX idx_weather_alert (weather_alert)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: DIVISION_HISTORY
-- Description: Historical facts and cultural information about divisions
-- ============================================================================
CREATE TABLE DIVISION_HISTORY (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    division_id INT NOT NULL UNIQUE,
    historical_facts TEXT,
    best_time_to_visit VARCHAR(200),
    cultural_significance TEXT,
    tourist_count_yearly INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES DIVISIONS(division_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: USERS
-- Description: User accounts and profiles
-- ============================================================================
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    phone_number VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(500),
    user_type VARCHAR(50) DEFAULT 'Tourist',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: USER_PREFERENCES
-- Description: User settings and preferences
-- ============================================================================
CREATE TABLE USER_PREFERENCES (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    preferred_budget_range VARCHAR(20),
    preferred_categories JSON,
    preferred_temperature_min INT,
    preferred_temperature_max INT,
    weather_alerts_enabled BOOLEAN DEFAULT TRUE,
    theme_preference VARCHAR(50) DEFAULT 'light',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: BOOKMARKS
-- Description: User bookmarked/saved destinations
-- ============================================================================
CREATE TABLE BOOKMARKS (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_destination (user_id, destination_id),
    INDEX idx_user_id (user_id),
    INDEX idx_destination_id (destination_id),
    INDEX idx_bookmarked_at (bookmarked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: TRAVEL_PLANS
-- Description: User travel itineraries and trip plans
-- ============================================================================
CREATE TABLE TRAVEL_PLANS (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    description TEXT,
    travel_start_date DATE NOT NULL,
    travel_end_date DATE NOT NULL,
    budget DECIMAL(12, 2),
    expected_travelers INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_travel_dates (travel_start_date, travel_end_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: PLAN_ITEMS
-- Description: Individual destinations within a travel plan
-- ============================================================================
CREATE TABLE PLAN_ITEMS (
    plan_item_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    destination_id INT NOT NULL,
    day_number INT NOT NULL,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES TRAVEL_PLANS(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE CASCADE,
    INDEX idx_plan_id (plan_id),
    INDEX idx_destination_id (destination_id),
    INDEX idx_plan_day (plan_id, day_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ADMIN_USERS
-- Description: Administrative user accounts and roles
-- ============================================================================
CREATE TABLE ADMIN_USERS (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    admin_role VARCHAR(100) NOT NULL,
    can_manage_destinations BOOLEAN DEFAULT FALSE,
    can_manage_prices BOOLEAN DEFAULT FALSE,
    can_view_analytics BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_role (admin_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: ADMIN_LOGS
-- Description: Audit trail of administrative actions
-- ============================================================================
CREATE TABLE ADMIN_LOGS (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    destination_id INT,
    action_type VARCHAR(50) NOT NULL,
    action_details JSON,
    old_values JSON,
    new_values JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES ADMIN_USERS(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES DESTINATIONS(destination_id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_destination_id (destination_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- VIEWS (Optional - for common queries)
-- ============================================================================

-- View: Destinations with their division info and latest weather
CREATE OR REPLACE VIEW vw_destinations_with_weather AS
SELECT 
    d.destination_id,
    d.spot_name,
    d.description,
    div.division_name,
    d.latitude,
    d.longitude,
    d.map_url,
    w.temperature,
    w.weather_condition,
    w.weather_alert,
    w.recorded_at
FROM DESTINATIONS d
JOIN DIVISIONS div ON d.division_id = div.division_id
LEFT JOIN WEATHER_DATA w ON d.destination_id = w.destination_id 
    AND w.recorded_at = (
        SELECT MAX(recorded_at) 
        FROM WEATHER_DATA 
        WHERE destination_id = d.destination_id
    );

-- View: Destinations with cost information
CREATE OR REPLACE VIEW vw_destinations_with_costs AS
SELECT 
    d.destination_id,
    d.spot_name,
    div.division_name,
    ct.season,
    (ct.base_cost + ct.transport_cost + ct.accommodation_cost + ct.food_cost + ct.other_cost) AS total_estimated_cost,
    ct.valid_from,
    ct.valid_to
FROM DESTINATIONS d
JOIN DIVISIONS div ON d.division_id = div.division_id
LEFT JOIN COST_TIERS ct ON d.destination_id = ct.destination_id
    AND CURDATE() BETWEEN ct.valid_from AND ct.valid_to;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample divisions
INSERT INTO DIVISIONS (division_name, description, latitude, longitude, hero_image_url) VALUES
('Dhaka', 'Capital city of Bangladesh with rich historical heritage', 23.8103, 90.4125, 'dhaka.jpg'),
('Chittagong', 'Major port city with beautiful beaches', 22.3569, 91.7832, 'chittagong.jpg'),
('Sylhet', 'Tea gardens and natural beauty in northeast', 24.8949, 91.8687, 'sylhet.jpg'),
('Khulna', 'Gateway to Sundarban mangrove forests', 22.8456, 89.5644, 'khulna.jpg'),
('Rajshahi', 'Ancient historical sites and silk industries', 24.3745, 88.6042, 'rajshahi.jpg'),
('Barisal', 'Coastal division with river isles', 22.1936, 90.3636, 'barisal.jpg'),
('Rangpur', 'Agricultural hub in northern region', 25.7479, 89.2750, 'rangpur.jpg'),
('Mymensingh', 'Agricultural and educational center', 24.7471, 90.4203, 'mymensingh.jpg');

-- Insert sample categories
INSERT INTO CATEGORIES (category_name, description, icon_url) VALUES
('Beach', 'Coastal and beach attractions', 'beach-icon.svg'),
('Hill', 'Hill stations and mountain areas', 'hill-icon.svg'),
('Heritage', 'Historical and cultural sites', 'heritage-icon.svg'),
('Nature', 'Natural parks and wildlife', 'nature-icon.svg'),
('Religious', 'Temples, mosques and religious sites', 'religious-icon.svg'),
('Urban', 'City attractions and modern sites', 'urban-icon.svg');

-- ============================================================================
-- INDEXES SUMMARY
-- ============================================================================
-- Foreign Key Indexes (for JOIN performance)
-- - DESTINATIONS.division_id -> DIVISIONS.division_id
-- - SPOT_CATEGORIES.destination_id, category_id
-- - ACCOMMODATION.destination_id
-- - COST_TIERS.destination_id
-- - WEATHER_DATA.destination_id
-- - DIVISION_HISTORY.division_id
-- - USER_PREFERENCES.user_id
-- - BOOKMARKS.user_id, destination_id
-- - TRAVEL_PLANS.user_id
-- - PLAN_ITEMS.plan_id, destination_id
-- - ADMIN_USERS.user_id
-- - ADMIN_LOGS.admin_id, destination_id

-- Search Indexes
-- - DIVISIONS.division_name
-- - DESTINATIONS.spot_name
-- - ACCOMMODATION.hotel_name
-- - USERS.email

-- Filter Indexes
-- - DESTINATIONS.category_type
-- - COST_TIERS.destination_id, season, valid_period
-- - WEATHER_DATA.weather_alert
-- - USERS.user_type, is_active

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
