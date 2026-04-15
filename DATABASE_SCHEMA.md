# Ghuri-Phiri: Database Schema Diagram

## Project Overview
**Ghuri-Phiri: A Smart Tourist Guide & Budget Planner for Bangladesh**

A comprehensive web application that provides centralized information about tourist destinations across Bangladesh with integrated travel cost estimation, real-time weather alerts, and smart filtering capabilities.

---

## Database Architecture Diagram

**Relationship Legend:**
- `||--||` = One-to-One (1:1)
- `||--o{` = One-to-Many (1:N)  
- `}o--o{` = Many-to-Many (M:N)

```mermaid
erDiagram
    DIVISIONS ||--o{ DESTINATIONS : "1:N contains"
    DIVISIONS ||--|| DIVISION_HISTORY : "1:1 has"
    DESTINATIONS }o--o{ CATEGORIES : "M:N through"
    DESTINATIONS ||--o{ ACCOMMODATION : "1:N features"
    DESTINATIONS ||--o{ WEATHER_DATA : "1:N contains"
    DESTINATIONS ||--o{ COST_TIERS : "1:N has"
    SPOT_CATEGORIES ||--|| DESTINATIONS : "N:1"
    SPOT_CATEGORIES ||--|| CATEGORIES : "N:1"
    USERS ||--|| USER_PREFERENCES : "1:1 has"
    USERS ||--o{ BOOKMARKS : "1:N creates"
    BOOKMARKS ||--|| DESTINATIONS : "N:1 references"
    USERS ||--o{ TRAVEL_PLANS : "1:N creates"
    TRAVEL_PLANS ||--o{ PLAN_ITEMS : "1:N contains"
    PLAN_ITEMS ||--|| DESTINATIONS : "N:1 referenced_in"
    USERS ||--|| ADMIN_USERS : "1:1"
    ADMIN_USERS ||--o{ ADMIN_LOGS : "1:N performs"
    ADMIN_LOGS ||--|| DESTINATIONS : "N:1 modifies"

    DIVISIONS {
        int division_id PK
        string division_name UK
        text description
        decimal latitude
        decimal longitude
        string hero_image_url
        int total_spots
        timestamp created_at
        timestamp updated_at
    }

    DESTINATIONS {
        int destination_id PK
        int division_id FK
        string spot_name UK
        text description
        text historical_background
        string category_type
        decimal latitude
        decimal longitude
        string map_url
        string image_gallery
        timestamp created_at
        timestamp updated_at
    }

    SPOT_CATEGORIES {
        int spot_category_id PK
        int destination_id FK
        int category_id FK
        timestamp assigned_at
    }

    CATEGORIES {
        int category_id PK
        string category_name UK
        text description
        string icon_url
        timestamp created_at
    }

    ACCOMMODATION {
        int accommodation_id PK
        int destination_id FK
        string hotel_name
        string hotel_type
        decimal star_rating
        decimal price_per_night
        string contact_number
        string website_url
        string address
        timestamp created_at
        timestamp updated_at
    }

    COST_TIERS {
        int cost_tier_id PK
        int destination_id FK
        string season
        decimal base_cost
        decimal transport_cost
        decimal accommodation_cost
        decimal food_cost
        decimal other_cost
        date valid_from
        date valid_to
        timestamp created_at
        timestamp updated_at
    }

    WEATHER_DATA {
        int weather_id PK
        int destination_id FK
        decimal temperature
        int humidity
        string weather_condition
        string weather_alert
        decimal wind_speed
        string wind_direction
        decimal precipitation
        timestamp recorded_at
        timestamp forecast_until
    }

    DIVISION_HISTORY {
        int history_id PK
        int division_id FK "1:1 relationship"
        text historical_facts
        string best_time_to_visit
        text cultural_significance
        int tourist_count_yearly
        timestamp created_at
        timestamp updated_at
    }

    SPOT_CATEGORIES {
        int spot_category_id PK
        int destination_id FK "N:1 to DESTINATIONS"
        int category_id FK "N:1 to CATEGORIES"
        timestamp assigned_at
    }

    USERS {
        int user_id PK
        string email UK
        string password_hash
        string full_name
        string phone_number
        text bio
        string profile_image_url
        string user_type
        boolean is_active
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    USER_PREFERENCES {
        int preference_id PK
        int user_id FK "1:1 relationship"
        string preferred_budget_range
        string preferred_categories
        int preferred_temperature_min
        int preferred_temperature_max
        boolean weather_alerts_enabled
        string theme_preference
        timestamp updated_at
    }

    BOOKMARKS {
        int bookmark_id PK
        int user_id FK "N:1 to USERS"
        int destination_id FK "N:1 to DESTINATIONS"
        timestamp bookmarked_at
    }

    TRAVEL_PLANS {
        int plan_id PK
        int user_id FK "N:1 to USERS"
        string plan_name
        text description
        date travel_start_date
        date travel_end_date
        decimal budget
        int expected_travelers
        timestamp created_at
        timestamp updated_at
    }

    PLAN_ITEMS {
        int plan_item_id PK
        int plan_id FK "N:1 to TRAVEL_PLANS"
        int destination_id FK "N:1 to DESTINATIONS"
        int day_number
        text notes
        timestamp added_at
    }

    ADMIN_USERS {
        int admin_id PK
        int user_id FK "1:1 relationship"
        string admin_role
        boolean can_manage_destinations
        boolean can_manage_prices
        boolean can_view_analytics
        timestamp created_at
    }

    ADMIN_LOGS {
        int log_id PK
        int admin_id FK "N:1 to ADMIN_USERS"
        int destination_id FK "N:1 to DESTINATIONS"
        string action_type
        text action_details
        string old_values
        string new_values
        timestamp created_at
    }
```

---

## Key Table Summary

| Table Name | Purpose | Primary Entity |
|---|---|---|
| **DIVISIONS** | Administrative regions in Bangladesh | Division |
| **DESTINATIONS** | Tourist spots and attractions | Tourist Spot |
| **CATEGORIES** | Destination types (Beach, Hill, Heritage) | Category Type |
| **SPOT_CATEGORIES** | Many-to-many junction table | Relationship |
| **ACCOMMODATION** | Hotels and lodging options | Hotel/Resort |
| **COST_TIERS** | Seasonal pricing information | Cost Management |
| **WEATHER_DATA** | Real-time weather conditions | Weather Info |
| **DIVISION_HISTORY** | Historical and cultural facts | Division History |
| **USERS** | User accounts and profiles | User Account |
| **USER_PREFERENCES** | User settings and preferences | User Settings |
| **BOOKMARKS** | Saved favorite destinations | Bookmark |
| **TRAVEL_PLANS** | User itineraries and plans | Travel Plan |
| **PLAN_ITEMS** | Destinations within a plan | Plan Item |
| **ADMIN_USERS** | Admin accounts and roles | Admin Account |
| **ADMIN_LOGS** | Audit trail of admin actions | Audit Log |

---

## Key Relationships Summary

| Source Table | Target Table | Relationship | Type |
|-------------|-------------|-------------|------|
| DIVISIONS | DESTINATIONS | One Division has Many Destinations | 1:N |
| DIVISIONS | DIVISION_HISTORY | One Division has One History | 1:1 |
| DESTINATIONS | SPOT_CATEGORIES | One Destination has Many Categories | N:N |
| CATEGORIES | SPOT_CATEGORIES | One Category has Many Destinations | N:N |
| DESTINATIONS | ACCOMMODATION | One Destination has Many Hotels | 1:N |
| DESTINATIONS | COST_TIERS | One Destination has Many Cost Tiers | 1:N |
| DESTINATIONS | WEATHER_DATA | One Destination has Many Weather Records | 1:N |
| USERS | USER_PREFERENCES | One User has One Preference | 1:1 |
| USERS | BOOKMARKS | One User has Many Bookmarks | 1:N |
| DESTINATIONS | BOOKMARKS | One Destination has Many Bookmarks | 1:N |
| USERS | TRAVEL_PLANS | One User has Many Plans | 1:N |
| TRAVEL_PLANS | PLAN_ITEMS | One Plan has Many Items | 1:N |
| DESTINATIONS | PLAN_ITEMS | One Destination in Many Plans | 1:N |
| USERS | ADMIN_USERS | One User is One Admin | 1:1 |
| ADMIN_USERS | ADMIN_LOGS | One Admin makes Many Logs | 1:N |
