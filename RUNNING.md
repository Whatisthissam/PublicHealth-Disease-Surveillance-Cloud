# 🏃‍♂️ Application Execution and Setup Guide

This guide details how to setup and run the **PublicHealth Disease Surveillance Cloud** platform for local development, testing, and production simulation.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your host system:
* **Node.js**: `v18.x` or `v20.x` (recommended)
* **npm**: `v9.x` or higher
* **MySQL Server**: `v8.0`
* **Docker & Docker Compose** (optional, for containerized execution)

---

## 🗄️ Step 1: Database Setup (MySQL)

This application stores surveillance data in a MySQL database. Follow these steps to configure your database:

1. **Start MySQL Server**:
   Make sure your local MySQL daemon is running.
   * **macOS** (via Homebrew):
     ```bash
     brew services start mysql
     ```
   * **Linux** (systemd):
     ```bash
     sudo systemctl start mysql
     ```
   * **Windows**: Start MySQL through the Services app or MySQL Notifier.

2. **Initialize Database**:
   Log in to MySQL as root and create the database:
   ```sql
   mysql -u root -p
   
   -- Once logged in:
   CREATE DATABASE publichealth_cloud;
   EXIT;
   ```

3. **Import Schema**:
   Import the 7-table surveillance schema:
   ```bash
   mysql -u root -p publichealth_cloud < database/schema.sql
   ```

4. **Import Seed Data**:
   Seed the database with default regions, users, cases, reports, and workflow tasks:
   ```bash
   mysql -u root -p publichealth_cloud < database/seed.sql
   ```

5. **Hash Default Passwords**:
   By default, seed database passwords are plain-text. Run the bcrypt seeding utility to secure all user accounts:
   ```bash
   # From the backend folder:
   cd backend
   npm install
   node utils/fix-passwords.js
   ```
   *This utility hashes all passwords to `Admin@123`.*

---

## 💻 Step 2: Local Development Setup

We provide convenient helper scripts in the root `package.json` to manage dependencies and dev servers from a single terminal.

### 1. Install All Dependencies
From the project root directory, run:
```bash
npm run install:all
```
*This installs dependencies for both the `/backend` and `/frontend` folders.*

### 2. Configure Environment Variables
You must configure the `.env` variables for both directories.

* **Backend Environment** (`/backend/.env`):
  Copy `/backend/.env.example` to `/backend/.env` and adjust the variables:
  ```env
  PORT=3001
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=publichealth_cloud
  DB_USER=root
  DB_PASSWORD=your_mysql_root_password
  JWT_SECRET=your_super_secret_jwt_key_min32chars
  CORS_ORIGIN=http://localhost:5174
  ```

* **Root Environment** (`/.env`):
  Copy `/.env.example` to `/.env` and update configuration values accordingly.

### 3. Start Development Servers

* **Start Backend API** (Runs on `http://localhost:3001`):
  ```bash
  npm run dev:backend
  ```
  *(Launches database connection verification and runs server in hot-reload mode via nodemon)*

* **Start Frontend Dev Server** (Runs on `http://localhost:5174` or `5173`):
  ```bash
  npm run dev:frontend
  ```
  *(Launches Vite development server)*

Once both servers are running, open your browser and navigate to `http://localhost:5174` (or the port shown in your terminal).

---

## 🐳 Step 3: Run via Docker Compose

To run the entire stack (MySQL Database + Express Backend API + Nginx Static Frontend) in Docker, use the following commands from the root directory:

1. **Setup root environment file**:
   ```bash
   cp backend/.env.example .env
   # Edit .env and adjust DB_PASSWORD and JWT_SECRET
   ```

2. **Launch Container Orchestration**:
   ```bash
   npm run docker:up
   ```
   *This starts:*
   * `mysql_db` container on port `3306` (stores data in persistent volume `mysql_data`)
   * `backend_api` container on port `3001` (waiting for database health check)
   * `frontend_web` container on port `80` (static React server backed by Nginx)

3. **Access Services**:
   * Frontend Application: `http://localhost`
   * Backend API: `http://localhost:3001`
   * Health Endpoint: `http://localhost:3001/health`

4. **Shutdown Containers**:
   ```bash
   npm run docker:down
   ```

---

## 🔑 Default User Accounts

Use these credentials to log in when running locally or via Docker:

| Role | Username | Password | Purpose |
|------|----------|----------|---------|
| **Admin** | `admin` | `Admin@123` | System configuration, user management (CRUD) |
| **Manager** | `manager_mum` | `Admin@123` | Report approvals, workflow overrides, monitoring |
| **Staff** | `staff_mum_1` | `Admin@123` | Creating & updating cases, checking tasks |

---

## 🛠️ Database & Connection Troubleshooting

If you encounter database connection errors while starting the backend, check these common issues:

### 1. `Access denied for user 'root'@'localhost'`
This indicates that the MySQL `root` user password on your host does not match the `DB_PASSWORD` set in your `backend/.env`.
* **Fix**: Reset your local root password to match `Admin@123`:
  ```bash
  mysql -u root
  # If that fails due to password settings, try skipping password:
  mysql -u root --skip-password
  ```
  Inside the MySQL prompt, update the password:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'Admin@123';
  FLUSH PRIVILEGES;
  EXIT;
  ```

### 2. `Can't connect to MySQL server on '127.0.0.1'` (or `ECONNREFUSED`)
This means the MySQL server daemon is either stopped or running on a different port.
* **Fix (macOS)**: Restart the Homebrew service:
  ```bash
  brew services restart mysql
  ```
* **Fix (Linux)**: Restart the system service:
  ```bash
  sudo systemctl restart mysql
  ```

### 3. `Table 'publichealth_cloud.users' doesn't exist`
This means the connection is successful, but the schema or tables were not fully created.
* **Fix**: Re-import the database schema:
  ```bash
  mysql -u root -pAdmin@123 publichealth_cloud < database/schema.sql
  mysql -u root -pAdmin@123 publichealth_cloud < database/seed.sql
  ```

### 4. `CORS error` or blank dashboard in browser
This happens if the frontend URL port doesn't match the port allowed by the backend CORS configuration.
* **Fix**: Open your browser dev console, check the port where Vite is running (usually `http://localhost:5174` or `5173`), and update `CORS_ORIGIN` in `backend/.env` to match it:
  ```env
  CORS_ORIGIN=http://localhost:5174
  ```
