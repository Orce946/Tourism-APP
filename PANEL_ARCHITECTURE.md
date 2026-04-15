# Panel Architecture - Ghuri-Phiri

## Overview
The application has three main levels:

```
1. PUBLIC FRONTEND (frontend/home, frontend/divisions, frontend/[divisions]/)
   └─ Available to: Everyone (No login required)
   
2. USER PANEL (frontend/panels/user/)
   └─ Available to: Registered Users (Login required)
   └─ Features: Bookmarks, Travel Plans, Profile, Dashboard
   
3. ADMIN PANEL (frontend/panels/admin/)
   └─ Available to: Admin Users Only (Special login required)
   └─ Features: Manage Destinations, Users, Pricing, Analytics, Logs
```

---

## Directory Structure

```
frontend/
├── home/                          (Public - Home page)
├── divisions/                     (Public - Division template)
├── [division folders]/            (Public - Division pages)
│
└── panels/                        ⭐ NEW
    ├── admin/                     (Admin Only)
    │   ├── authentication/        (Admin Login/Register)
    │   │   ├── login.html
    │   │   ├── register.html
    │   │   ├── forgot-password.html
    │   │   └── admin-auth.js
    │   │
    │   └── pages/                 (Admin Dashboard Pages)
    │       ├── dashboard.html     (Admin Home)
    │       ├── destinations.html  (Manage Attractions)
    │       ├── pricing.html       (Manage Costs)
    │       ├── users.html         (Manage Users)
    │       ├── analytics.html     (View Stats)
    │       ├── audit-logs.html    (Admin Actions Log)
    │       └── admin-panel.js     (Admin functionality)
    │
    └── user/                      (Regular Users)
        ├── authentication/        (User Login/Register)
        │   ├── login.html
        │   ├── register.html
        │   ├── forgot-password.html
        │   └── user-auth.js
        │
        └── pages/                 (User Dashboard Pages)
            ├── dashboard.html     (User Profile/Home)
            ├── bookmarks.html     (Saved Places)
            ├── travel-plans.html  (Trip Itineraries)
            ├── profile.html       (Account Settings)
            └── user-panel.js      (User functionality)
```

---

## Authentication Flow

### User Authentication
```
1. User visits /frontend/panels/user/authentication/login.html
2. User enters email & password
3. user-auth.js validates credentials
4. On success: Redirect to /frontend/panels/user/pages/dashboard.html
5. Session stored in localStorage or sessionStorage
6. Protected pages check authentication before loading
```

### Admin Authentication
```
1. Admin visits /frontend/panels/admin/authentication/login.html
2. Admin enters admin email & admin password
3. admin-auth.js validates admin credentials
4. On success: Redirect to /frontend/panels/admin/pages/dashboard.html
5. Admin role verified (must be admin, not regular user)
6. Admin pages protected with role-based access
```

---

## Access Control

| Route | Public | User | Admin | Required |
|-------|--------|------|-------|----------|
| /frontend/home | ✅ | ✅ | ✅ | None |
| /frontend/divisions | ✅ | ✅ | ✅ | None |
| /frontend/[division] | ✅ | ✅ | ✅ | None |
| /frontend/panels/user/* | ❌ | ✅ | ❌ | User Login |
| /frontend/panels/admin/* | ❌ | ❌ | ✅ | Admin Login |

---

## User Panel Features

### Pages
1. **Dashboard** (`dashboard.html`)
   - User profile info
   - Quick stats (bookmarks count, plans count)
   - Recent activities
   - Recommendations

2. **Bookmarks** (`bookmarks.html`)
   - All saved destinations
   - Remove bookmark
   - Quick filters
   - Share options

3. **Travel Plans** (`travel-plans.html`)
   - Create new plan
   - View all plans
   - Edit/delete plans
   - Estimated cost calculation

4. **Profile** (`profile.html`)
   - Update account info
   - Change password
   - Preferences (budget, categories)
   - Notification settings

---

## Admin Panel Features

### Pages
1. **Dashboard** (`dashboard.html`)
   - Key metrics (total users, destinations, bookings)
   - Popular destinations chart
   - Recent user activity
   - Quick actions

2. **Destinations** (`destinations.html`)
   - List all destinations
   - Add new destination
   - Edit destination info
   - Delete destination
   - Upload images
   - Add accommodation info

3. **Pricing** (`pricing.html`)
   - Manage seasonal costs
   - Set transportation costs
   - Set accommodation rates
   - Food cost estimates
   - Bulk price updates

4. **Users** (`users.html`)
   - View all users
   - User statistics
   - Block/unblock users
   - View user activity
   - Export user data

5. **Analytics** (`analytics.html`)
   - User growth chart
   - Popular destinations
   - Budget distribution
   - Peak travel seasons
   - Regional statistics

6. **Audit Logs** (`audit-logs.html`)
   - All admin actions logged
   - Filter by action type
   - Filter by date range
   - Filter by admin user
   - Export logs

---

## Session Management

### LocalStorage Keys
```javascript
// User Session
localStorage.setItem('user_id', '123');
localStorage.setItem('user_email', 'user@example.com');
localStorage.setItem('user_token', 'jwt_token_here');
localStorage.setItem('user_type', 'tourist');

// Admin Session
localStorage.setItem('admin_id', '456');
localStorage.setItem('admin_email', 'admin@example.com');
localStorage.setItem('admin_token', 'jwt_token_here');
localStorage.setItem('admin_role', 'super_admin');
```

### Session Validation
```javascript
// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('user_token') !== null;
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('admin_token') !== null;
}

// Check if user is admin
function isUserAdmin() {
    return localStorage.getItem('user_type') === 'admin';
}
```

---

## Protected Page Pattern

### In User Panel Pages
```html
<script>
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        // Redirect to login
        window.location.href = '/frontend/panels/user/authentication/login.html';
    }
</script>
```

### In Admin Panel Pages
```html
<script>
    // Check if admin is logged in
    if (!isAdminLoggedIn()) {
        // Redirect to admin login
        window.location.href = '/frontend/panels/admin/authentication/login.html';
    }
    
    // Verify admin role
    if (localStorage.getItem('admin_role') !== 'super_admin' && 
        localStorage.getItem('admin_role') !== 'content_manager') {
        // Redirect unauthorized
        alert('Unauthorized access');
        window.location.href = '/frontend/home/';
    }
</script>
```

---

## Navigation Structure

### User Panel Navigation
```
Dashboard     [✓ Currently logged in as: USER NAME]
├─ Dashboard
├─ Bookmarks
├─ Travel Plans
├─ Profile Settings
└─ Logout
```

### Admin Panel Navigation
```
Admin Panel   [✓ Currently logged as: ADMIN NAME - ADMIN ROLE]
├─ Dashboard
├─ Destinations
├─ Pricing
├─ Users
├─ Analytics
├─ Audit Logs
└─ Logout
```

---

## Phase Implementation

### Phase 1 (Current)
- ✅ Folder structure created
- 🔄 Panel pages created (HTML only)
- ❌ Authentication logic (Next prompt)

### Phase 2
- 📅 Backend authentication API
- 📅 Database user management
- 📅 JWT token generation

### Phase 3
- 📅 Connect panels to backend
- 📅 Real data loading
- 📅 Full CRUD operations

---

## File Naming Convention

```
Authentication Files:
- [type]-auth.js (user-auth.js, admin-auth.js)

Page Files:
- [feature].html (dashboard.html, bookmarks.html)

Shared Files:
- shared-styles.css (Common styles for panels)
- shared-functions.js (Common utilities)
```

---

## Key Points

1. **Separation** - Admin and User panels are completely separate
2. **Security** - Each panel has its own authentication
3. **Navigation** - Users cannot access admin routes and vice versa
4. **Session** - Different localStorage keys for users vs admins
5. **Pages** - Next prompt will add authentication functionality

---

Created: April 15, 2026
Status: Architecture Phase Complete
Next: Authentication Implementation
