-- ============================================================
-- PublicHealth Disease Surveillance Cloud
-- Database Schema v1.0
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS publichealth_cloud
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE publichealth_cloud;

-- ============================================================
-- TABLE: regions
-- ============================================================
CREATE TABLE IF NOT EXISTS regions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL UNIQUE,
  state           VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
  country         VARCHAR(100) NOT NULL DEFAULT 'India',
  population      BIGINT,
  area_sq_km      DECIMAL(10,2),
  is_current      TINYINT(1) NOT NULL DEFAULT 1,
  priority        INT DEFAULT 99,
  status          ENUM('active','inactive','planned') NOT NULL DEFAULT 'active',
  health_centers  INT DEFAULT 0,
  hospitals       INT DEFAULT 0,
  description     TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_is_current (is_current)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(50) NOT NULL UNIQUE,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  role            ENUM('admin','manager','staff') NOT NULL DEFAULT 'staff',
  phone           VARCHAR(20),
  region          VARCHAR(100),
  department      VARCHAR(100),
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  last_login      DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_is_active (is_active),
  INDEX idx_region (region)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: disease_cases
-- ============================================================
CREATE TABLE IF NOT EXISTS disease_cases (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  case_id         VARCHAR(60) NOT NULL UNIQUE,
  disease_name    VARCHAR(100) NOT NULL,
  patient_id      VARCHAR(50) NOT NULL,
  region          VARCHAR(100) NOT NULL,
  status          ENUM('active','recovered','deceased','quarantined') NOT NULL DEFAULT 'active',
  severity        ENUM('mild','moderate','severe','critical') NOT NULL DEFAULT 'mild',
  date_reported   DATE NOT NULL,
  description     TEXT,
  age             INT,
  gender          ENUM('male','female','other'),
  contact_tracing TINYINT(1) DEFAULT 0,
  hospitalized    TINYINT(1) DEFAULT 0,
  vaccination_status ENUM('vaccinated','unvaccinated','partial','unknown') DEFAULT 'unknown',
  created_by      INT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_disease_name (disease_name),
  INDEX idx_region (region),
  INDEX idx_status (status),
  INDEX idx_severity (severity),
  INDEX idx_date_reported (date_reported),
  INDEX idx_patient_id (patient_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: reports
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  report_id       VARCHAR(60) NOT NULL UNIQUE,
  title           VARCHAR(255) NOT NULL,
  report_type     ENUM('daily','weekly','monthly','outbreak','custom') NOT NULL DEFAULT 'monthly',
  period_start    DATE,
  period_end      DATE,
  region          VARCHAR(100) DEFAULT 'All',
  summary         TEXT,
  status          ENUM('pending','under_review','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by     INT,
  reviewed_at     DATETIME,
  file_url        VARCHAR(500),
  created_by      INT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_report_type (report_type),
  INDEX idx_status (status),
  INDEX idx_region (region)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: workflow_tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_tasks (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  task_id         VARCHAR(60) NOT NULL UNIQUE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  assigned_to     INT,
  case_id         INT,
  priority        ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  status          ENUM('pending','under_review','approved','rejected') NOT NULL DEFAULT 'pending',
  due_date        DATE,
  notes           TEXT,
  created_by      INT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (case_id) REFERENCES disease_cases(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_priority (priority)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: alerts
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  alert_id        VARCHAR(60) NOT NULL UNIQUE,
  title           VARCHAR(255) NOT NULL,
  message         TEXT NOT NULL,
  alert_type      ENUM('cpu','memory','storage','outbreak','database','service','network','custom') NOT NULL DEFAULT 'custom',
  severity        ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  region          VARCHAR(100),
  status          ENUM('active','resolved','acknowledged') NOT NULL DEFAULT 'active',
  resolved_at     DATETIME,
  resolved_by     INT,
  created_by      INT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_severity (severity),
  INDEX idx_alert_type (alert_type)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT,
  action          ENUM('LOGIN','LOGOUT','CREATE','UPDATE','DELETE','VIEW','EXPORT') NOT NULL,
  entity_type     VARCHAR(50),
  entity_id       VARCHAR(50),
  description     TEXT,
  ip_address      VARCHAR(45),
  user_agent      TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;
