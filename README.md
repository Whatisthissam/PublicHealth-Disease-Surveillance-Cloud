# 🏥 PublicHealth Disease Surveillance Cloud

> **AWS Cloud Computing Case Study** — Enterprise-grade Public Health Surveillance Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)

---

## 📋 Project Overview

The **PublicHealth Disease Surveillance Cloud** is a production-grade web application built to simulate an enterprise disease surveillance system for public health departments. It showcases a modern, secure, cloud-native architecture optimized for tracking and responding to epidemiological events across geographical regions (modeled on Maharashtra, India).

---

## ❓ Problem Statement

Public health departments face critical challenges in monitoring and managing regional health security due to:
* **Fragmented Real-Time Tracking**: Delays in reporting case counts from remote clinics lead to slow outbreak detection.
* **Coordination Gaps**: Lack of centralized workflow systems hampers communication between field investigators, regional managers, and administrators.
* **Complex Data Analysis**: Aggregating data across multiple regions into actionable executive dashboards is slow and manually driven.
* **Security & Compliance**: Storing sensitive patient demographics and audit trails requires strict compliance standards and robust role-based access control.

---

## 🎯 Proposed Solution

This platform addresses health security challenges through a **cloud-native, multi-tier public health dashboard**:
1. **Real-time Case Telemetry**: Instant data entry and updates with immediate dashboard updates.
2. **Role-Based Access Control (RBAC)**: Defined privileges for **Admin** (user audit and management), **Manager** (report approvals and alerts), and **Staff** (case creation and workflows).
3. **Structured Alerting**: Automated monitoring dashboards that trigger system and epidemiological warning notifications.
4. **Data Governance & Audit**: Full audit logging tracks every change made to users, records, and tasks, satisfying compliance criteria.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                               │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │CloudFront│→  │   AWS EC2    │   │      AWS RDS           │  │
│  │  (CDN)   │   │  (Backend)   │→  │   MySQL 8.0            │  │
│  └──────────┘   └──────────────┘   └────────────────────────┘  │
│       ↑                ↑                        ↑              │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────┐  │
│  │  AWS S3  │   │  AWS ELB     │   │   AWS CloudWatch       │  │
│  │ (Static) │   │ (Load Bal.)  │   │   (Monitoring)         │  │
│  └──────────┘   └──────────────┘   └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         ↑
              ┌──────────────────────┐
              │   LOCAL DEVELOPMENT  │
              │  React + Vite (5174) │
              │  Express API  (3001) │
              │  MySQL DB     (3306) │
              └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS | Core UI development and build system |
| **Animations** | Framer Motion | Fluid interface transitions and visual indicators |
| **Charts** | Recharts | Multi-dimensional epidemiological trend data visualization |
| **HTTP Client** | Axios | Frontend-backend API requests with auth interceptors |
| **Backend** | Node.js, Express.js | Core API servers and endpoint routing |
| **Database** | MySQL 8.0 | Relational database (schema & default seeds) |
| **Auth & Security**| JWT (JSON Web Tokens) & BcryptJS | Token-based sessions and password hashing |
| **Middlewares** | Helmet.js, CORS, express-rate-limit | API rate-limiting, security headers, cross-origin resource sharing |
| **Container** | Docker & Docker Compose | Multi-container system testing and build reproduction |

---

## ✨ Core Features

* **Authentication & RBAC**: JWT authorization with 24-hour token expiry and secure password hashing.
* **Operational Dashboard**: Static flat KPI cards, monthly case trends, disease distribution charts, and service status checks.
* **Disease Record CRUD**: Paginated search, filter, creation, and modification of regional disease logs.
* **Approval Workflows**: Kanban board status transitions for case analysis (Pending → Under Review → Approved/Rejected).
* **Monitoring & Alert Center**: Host system telemetry and service heartbeat checks with resolution triggers.
* **Executive Portal**: Growth metrics, regional burden stats, and resource utilization indicators.
* **Expansion Roadmapping**: Map interface highlighting current, planned, and future expansion phases.

---

## 🏃 Setup and Execution

To run this application locally for development or using Docker, refer to the detailed instructions in the [RUNNING.md](RUNNING.md) guide.

---

## ☁️ Production AWS Deployment Strategy

The system is designed to be fully cloud-ready for AWS deployment:
* **Compute**: Host the Express Backend on Auto-Scaled **EC2 (t3.medium)** instances in a private subnet behind an **Application Load Balancer (ALB)**.
* **Frontend**: Deploy static React assets in **AWS S3** served globally via **CloudFront CDN**.
* **Database**: Set up a managed **AWS RDS MySQL** instance configured with Multi-AZ backups for high availability.
* **Security**: Enforce network isolation using **Amazon VPC**, secure database credentials inside **Secrets Manager**, and enable **WAF** (Web Application Firewall) protection.
* **Observability**: Configure **CloudWatch** metrics, dashboard alerts, and target alarms (e.g. CPU > 80%, Outbreak Threshold) to automatically notify team members.

---

## 🔮 Future Roadmap

1. **SageMaker Outbreak Forecasting**: Integrate machine learning models to predict infection curves.
2. **GIS Spatial Mapping**: Transition to rich spatial visualizations using Amazon Location Service.
3. **Field Notifications**: Connect alerts to AWS SNS and SES for automated text and email notifications.
