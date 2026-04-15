# Ghuri-Phiri: Project Architecture

## Project Structure Overview

```
Tourism-APP/
├── frontend/                      # Frontend application (HTML pages)
│   ├── home/
│   │   └── index.html            # Home/Landing page (formerly ui.html)
│   ├── divisions/
│   │   └── division.html         # Division detail page template
│   ├── barisal/
│   │   └── index.html            # Barisal division page
│   ├── chittagong/
│   │   └── index.html            # Chittagong division page
│   ├── dhaka/
│   │   └── index.html            # Dhaka division page
│   ├── khulna/
│   │   └── index.html            # Khulna division page
│   ├── mymensingh/
│   │   └── index.html            # Mymensingh division page
│   ├── rajshahi/
│   │   └── index.html            # Rajshahi division page
│   ├── rangpur/
│   │   └── index.html            # Rangpur division page
│   └── sylhet/
│       └── index.html            # Sylhet division page
│
├── backend/                       # Backend application (For future API)
│   └── (Node.js/Express code will go here)
│
├── database/                      # Database files
│   └── database.sql              # MySQL schema and initial data
│
├── assets/                        # Static assets
│   ├── css/
│   │   └── style.css             # Main stylesheet
│   ├── js/
│   │   └── script.js             # Main JavaScript file
│   └── images/
│       ├── dhaka.jpg
│       ├── chittagong.jpg
│       ├── sylhet.jpg
│       ├── khulna.jpg
│       ├── rajshahi.jpg
│       ├── barisal.jpg
│       ├── rangpur.jpg
│       ├── mymensingh.jpg
│       └── bg picture.jpeg
│
├── data/                          # Data files
│   └── destinations.json         # Destination data
│
├── DATABASE_SCHEMA.md             # Database schema documentation
└── PROJECT_STRUCTURE.md           # This file
```

---

## Page Organization & Navigation

### Frontend Pages Structure

| Page | Location | Route | Purpose |
|------|----------|-------|---------|
| **Home** | `frontend/home/index.html` | `/` | Main landing page with division overview |
| **Division Details** | `frontend/divisions/division.html` | `/?division={id}` | Shows details of a specific division |
| **Barisal** | `frontend/barisal/index.html` | `/barisal/` | Barisal division details |
| **Chittagong** | `frontend/chittagong/index.html` | `/chittagong/` | Chittagong division details |
| **Dhaka** | `frontend/dhaka/index.html` | `/dhaka/` | Dhaka division details |
| **Khulna** | `frontend/khulna/index.html` | `/khulna/` | Khulna division details |
| **Mymensingh** | `frontend/mymensingh/index.html` | `/mymensingh/` | Mymensingh division details |
| **Rajshahi** | `frontend/rajshahi/index.html` | `/rajshahi/` | Rajshahi division details |
| **Rangpur** | `frontend/rangpur/index.html` | `/rangpur/` | Rangpur division details |
| **Sylhet** | `frontend/sylhet/index.html` | `/sylhet/` | Sylhet division details |

---

## Navigation Flow

### Current Navigation (Frontend-Only)

```
[Home Page] ← → [Divisions Detail]
              ↓
    [Division Pages]
    (Barisal, Chittagong, Dhaka, etc.)
         ↓↓↓
    Back to Home
```

### Path References in HTML Files

All HTML files reference assets using relative paths based on their location:

**From any frontend page (depth level 2):**
```
CSS:          ../../assets/css/style.css
JavaScript:   ../../assets/js/script.js
Images:       ../../assets/images/[image-name]
Data:         ../../data/destinations.json
```

**Navigation Links:**
```
Home → Home:     ../home/index.html
Home → Division: ../divisions/division.html
Pages → Home:    ../home/index.html
```

---

## File Size Summary

```
frontend/        - All HTML pages
├── 10 HTML files (each ~3-4 KB)
│   Total: ~35-40 KB

assets/
├── css/          - 1 stylesheet (~13.7 KB)
├── js/           - 1 script file (~10.1 KB)  
└── images/       - 8 division images + 1 background
                   Total: ~1.8 MB

data/
└── destinations.json - 6.7 KB

database/
└── database.sql - 17.3 KB
```

---

## Key Features of New Structure

✅ **Organized Folders**
- Separated frontend, backend, and database concerns
- Assets organized by type (CSS, JS, Images)

✅ **Scalable Design**
- Each page gets its own folder for future expansion
- Easy to add new pages without cluttering root

✅ **Clean Navigation**
- All links properly reference new paths
- Navigation between pages works seamlessly

✅ **Proper Path References**
- CSS and JS correctly linked from all pages
- JSON data and images properly accessible

✅ **Backend Ready**
- `/backend` folder prepared for Node.js/Express code
- `/database` folder ready for SQL migrations

---

## How to Access Pages

### For Local Development (using Live Server or similar)

1. Start a local server in the project root:
   ```bash
   python3 -m http.server 8000
   ```

2. Open in browser:
   - Home: `http://localhost:8000/frontend/home/`
   - Division: `http://localhost:8000/frontend/divisions/division.html?division=dhaka`
   - Dhaka: `http://localhost:8000/frontend/dhaka/`

### For Production (when backend API is added)

Point your Express app to serve:
- Static files from `./frontend`
- API routes from `./backend`
- Database migrations from `./database`

---

## Next Steps for Development

### Phase 1: Backend Setup (Recommended)
```
1. Initialize Node.js in /backend
2. Set up Express server
3. Create API routes for destinations, costs, weather
4. Integrate with MySQL database
```

### Phase 2: Frontend to API Migration
```
1. Update script.js to fetch from API instead of JSON
2. Add error handling and loading states
3. Implement user authentication
```

### Phase 3: Database Integration
```
1. Import database.sql into MySQL
2. Add admin panel for content management
3. Implement real-time weather updates
```

### Phase 4: Deployment
```
1. Deploy backend to Node.js hosting
2. Deploy frontend to static hosting or same server
3. Set up CI/CD pipeline
```

---

## File Path Update Summary

### Updated Files:
- ✅ `assets/js/script.js` - Updated image paths and fetch URL
- ✅ `frontend/home/index.html` - Updated CSS/JS paths
- ✅ `frontend/divisions/division.html` - Updated CSS/JS paths and back link
- ✅ All division pages - Updated CSS/JS paths and back links

### Path Changes Made:
```
BEFORE                          AFTER
==========================================
style.css                  →  ../../assets/css/style.css
script.js                  →  ../../assets/js/script.js
destinations.json          →  ../../data/destinations.json
[image-name]               →  ../../assets/images/[image-name]
ui.html                    →  ../home/index.html
division.html              →  ../divisions/division.html
```

---

## Version
- **v1.0** - Initial project reorganization
- **Date:** 2026-04-15
- **Status:** ✅ Complete and Tested
