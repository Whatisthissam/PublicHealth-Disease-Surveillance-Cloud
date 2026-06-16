# 📋 PublicHealth Disease Surveillance Cloud — My Task Guide

> **Purpose**: This file documents what is broken in the UI, what the target UI looks like, what I (the AI) will fix automatically, and what YOU need to do manually (database setup, environment config, etc.)

---

## 🔴 CURRENT PROBLEMS (Why the UI is Blank / Not Working)

### Problem 1: Frontend Loads But Login Does Nothing
**Root Cause**: The frontend (`http://localhost:5173`) tries to call the backend at `http://localhost:3001/api/auth/login`.
The backend is **not running** and is **not connected to MySQL**.
When login is pressed → API call fails → error is thrown → nothing happens visually.

### Problem 2: UI Doesn't Match the Target Design
The image you shared shows a **clean, light lavender/white healthcare UI** with:
- A top navigation bar with logo + nav links + CTA button
- A large hero section with "Healthcare" headline
- Floating glassmorphic cards with stats (patient counts etc.)
- A "Our Services" grid with icon cards
- A footer with contact, service links, social icons

The **current UI** is a locked internal dashboard app (login wall → sidebar layout → data tables).  
The design system is partially correct (lavender/glass cards) but the **Login page and Dashboard layout** don't match the target aesthetic.

### Problem 3: No Mock / Fallback Data
Every page (Dashboard, Records, Analytics, etc.) calls the real backend API.  
If the backend is down → all pages show either a blank spinner or nothing.  
There is **no demo/mock data fallback** in the frontend.

### Problem 4: Tailwind Classes Are Missing at Runtime
Several custom Tailwind classes used in JSX (`bg-gradient-lavender`, `bg-gradient-health`, `bg-gradient-primary`, `shadow-float`, `shadow-card`) are defined in `tailwind.config.js` but some may not generate correctly because the CSS uses `@apply` referencing classes that Tailwind only generates via the `backgroundImage` key — this can cause **invisible/broken gradient backgrounds**.

---

## ✅ WHAT I (THE AI) WILL FIX AUTOMATICALLY

After you complete the manual steps below, I will:

1. **Redesign the Login Page** to match the target aesthetic:
   - Clean light lavender/white top navbar
   - Large centered hero card with healthcare branding
   - Floating stat cards with glassmorphism
   - "Sign In" form embedded in a beautiful split layout

2. **Redesign the Dashboard Layout** (sidebar + top bar) to match the target:
   - Sleek top navigation instead of heavy sidebar
   - Card grid for KPIs with better visual hierarchy
   - Animated entry transitions

3. **Add mock/demo data fallback** so the UI works even without a DB connection

4. **Fix CSS gradient class issues** in `tailwind.config.js` and `index.css`

5. **Add a public landing page** matching the target design (healthcare hero section + services grid + footer) before the login wall

---

## 🛠️ WHAT YOU NEED TO DO MANUALLY

### STEP 1 — Install MySQL on Your Mac

> ⚠️ **This is the most critical step.** Nothing works without MySQL running locally.

**Option A: Using Homebrew (Recommended)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure the installation (set root password)
mysql_secure_installation
```

**Option B: Download MySQL Installer**
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server 8.0** for macOS
3. Run the `.dmg` installer
4. During installation, set a **root password** — remember it!
5. After installation, start MySQL from **System Preferences → MySQL → Start**

---

### STEP 2 — Create the Database

Open your terminal and log in to MySQL:
```bash
mysql -u root -p
# Enter your root password when prompted
```

Then run:
```sql
SOURCE /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/database/schema.sql;
SOURCE /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/database/seed.sql;
```

Or you can run each file from terminal directly:
```bash
mysql -u root -p < /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/database/schema.sql
mysql -u root -p < /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/database/seed.sql
```

This will create the `publichealth_cloud` database and seed it with:
- 10 regions (Mumbai, Pune, Nagpur, etc.)
- Demo users (admin, manager, staff)
- Disease cases, workflow tasks, alerts, reports

---

### STEP 3 — Configure the Backend `.env` File

Open the file:
```
/Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/.env
```

Update these values:
```env
NODE_ENV=development
PORT=3001

# MySQL Database — UPDATE THESE
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=publichealth_cloud
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_MYSQL_ROOT_PASSWORD   ← Change this!

# JWT — change to any long random string
JWT_SECRET=mySecretKey_publichealth_surveillance_2024_change_this

JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

Also update the backend-specific env file:
```
/Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/backend/.env
```
(Same values as above)

---

### STEP 4 — Install Node.js Dependencies

Open terminal and run:

```bash
# Install root-level dependencies (if any)
cd /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### STEP 5 — Start the Backend Server

```bash
cd /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/backend
npm run dev
```

You should see:
```
✅ MySQL Database connected successfully
   Host: localhost:3306
   Database: publichealth_cloud
🚀 PublicHealth Disease Surveillance API
   Server URL  : http://localhost:3001
```

If you see `❌ Database connection failed` → your MySQL password in `.env` is wrong.

---

### STEP 6 — Start the Frontend

Open a **new terminal tab/window**:
```bash
cd /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/frontend
npm run dev
```

You should see:
```
  VITE v5.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open your browser at: **http://localhost:5173**

---

### STEP 7 — Test Login with Demo Accounts

| Role    | Username      | Password |
|---------|---------------|----------|
| Admin   | `admin`       | `password` |
| Manager | `manager_mum` | `password` |
| Staff   | `staff_mum_1` | `password` |

---

## 🐛 TROUBLESHOOTING

### "MySQL connection refused" on backend start
- MySQL service is not running → run: `brew services start mysql`
- Wrong password in `.env` → double-check `DB_PASSWORD`

### "Table 'publichealth_cloud.users' doesn't exist"
- You skipped Step 2 → run the schema.sql and seed.sql files

### Frontend shows blank white page
- Open browser DevTools (F12) → Console tab → look for red errors
- Common cause: backend not running → start backend first (Step 5)

### Login button does nothing / spins forever
- Backend is not running or not connected to DB
- Check terminal where backend is running for error messages

### "CORS error" in browser console
- Backend `CORS_ORIGIN` doesn't match frontend URL
- Make sure both `.env` files have: `CORS_ORIGIN=http://localhost:5173`

### Port 3001 already in use
```bash
lsof -ti:3001 | xargs kill -9
```

### Port 5173 already in use
```bash
lsof -ti:5173 | xargs kill -9
```

---

## 📂 PROJECT STRUCTURE OVERVIEW

```
PublicHealth-Disease-Surveillance-Cloud/
├── frontend/                  # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/             # LoginPage, DashboardPage, etc.
│   │   ├── components/        # Layout (sidebar + topbar)
│   │   ├── context/           # AuthContext (JWT state)
│   │   ├── services/          # api.js (axios calls to backend)
│   │   ├── App.jsx            # Router + protected routes
│   │   └── index.css          # Global design system + Tailwind
│   ├── tailwind.config.js     # Custom colors, gradients, shadows
│   └── vite.config.js         # Dev server + /api proxy to :3001
│
├── backend/                   # Node.js + Express + MySQL
│   ├── controllers/           # Business logic (auth, cases, etc.)
│   ├── routes/                # API route definitions
│   ├── middlewares/           # JWT auth, error handler
│   ├── config/database.js     # MySQL connection pool
│   └── index.js               # Express server entry point
│
├── database/
│   ├── schema.sql             # CREATE TABLE statements
│   └── seed.sql               # INSERT demo data (users, cases, etc.)
│
├── .env                       # Root environment variables
└── my-task.md                 # ← YOU ARE HERE
```

---

## 🎨 TARGET UI DESIGN (What I Will Build)

Based on the screenshot you shared, the target design has:

| Element | Description |
|---------|-------------|
| **Background** | Soft lavender/periwinkle gradient (`#f0f4ff` → `#e8edff`) |
| **Navbar** | Light glass navbar with logo, nav links (Home, About, Vitality, Doctors), and "Sign In" button |
| **Hero Section** | Large "Healthcare" heading, floating stat card (Live patients count), search bar with blue pill button |
| **Services Grid** | 8 icon cards in 2×4 grid, white glass cards with heart icon + service name |
| **Footer** | 4-column: Contact info, Services list, Services list, Social icons + phone number |
| **Overall Feel** | Clean, minimal, white + lavender, generous whitespace, rounded corners, soft shadows |

### Key Design Tokens (Already in `tailwind.config.js`):
- Primary blue: `#5b7df8` / `#3d5aed`
- Background: `#f5f3ff` → `#ede9fe` (lavender gradient)
- Card: `rgba(255,255,255,0.85)` with `backdrop-blur`
- Border radius: `16px` (cards), `24px` (hero)
- Font: Inter (body), Poppins (headings)

---

## ⚡ QUICK START (Once MySQL is Running)

To start the project, you need to run both the backend and frontend in separate terminal tabs or windows:

```bash
# Terminal Tab 1: Start Backend
cd /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/backend
npm run dev

# Terminal Tab 2: Start Frontend
cd /Users/sameerrathod/Desktop/PublicHealth-Disease-Surveillance-Cloud/frontend
npm run dev
```

Open your browser at: **http://localhost:5173** (or **http://localhost:5174** if 5173 is occupied) and log in with your demo credentials!

---

*Generated by Antigravity AI — Last updated: June 2026*
