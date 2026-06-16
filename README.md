# Public Health Disease Surveillance Cloud

A cloud-based Public Health Disease Surveillance Platform deployed on AWS Cloud. The project demonstrates practical implementation of AWS cloud services, networking, Linux administration, containerization, monitoring, backup strategies, and cloud deployment best practices.

---

# Project Overview

The Public Health Disease Surveillance Cloud platform provides a centralized system for monitoring and managing disease-related information. The application is deployed on AWS infrastructure using Docker containers and follows cloud computing best practices for scalability, security, monitoring, and disaster recovery.

---

# Technology Stack

## Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Cloud & Infrastructure

* AWS EC2
* AWS VPC
* AWS IAM
* AWS S3
* AWS CloudWatch
* AWS AMI

## DevOps & Deployment

* Docker
* Docker Compose
* Linux (Ubuntu Server)
* Git & GitHub

---

# AWS Services Used

| Service          | Purpose                |
| ---------------- | ---------------------- |
| IAM              | Access Management      |
| VPC              | Network Isolation      |
| Subnet           | Network Segmentation   |
| Internet Gateway | Internet Connectivity  |
| Route Table      | Traffic Routing        |
| Security Group   | Firewall Configuration |
| EC2              | Application Hosting    |
| S3               | Cloud Storage          |
| CloudWatch       | Monitoring & Alerting  |
| AMI              | Backup & Recovery      |

---

# Application Architecture

<img src="IMPLEMENTATION_SCREENSHOTS/Architecture-Diagram.png" width="900">

---

# Project Features

* Disease Surveillance Dashboard
* Public Health Data Management
* Cloud-Based Deployment
* Containerized Architecture
* Secure AWS Networking
* Role-Based Access Control
* Cloud Monitoring
* Backup & Recovery Strategy
* Cost Optimization Practices

---

# AWS Infrastructure Setup

The following AWS components were configured:

* IAM User
* VPC
* Public Subnet
* Internet Gateway
* Route Table
* Security Group
* EC2 Instance
* S3 Bucket
* CloudWatch Alarm
* AMI Backup

---

# Deployment Process

### Clone Repository

```bash
git clone https://github.com/Whatisthissam/PublicHealth-Disease-Surveillance-Cloud.git
cd PublicHealth-Disease-Surveillance-Cloud
```

### Start Application

```bash
docker compose up -d --build
```

### Verify Containers

```bash
docker ps
```

### Access Application

```text
http://<EC2-Public-IP>
```

---

# Implementation Screenshots

## IAM User Creation

<img src="IMPLEMENTATION_SCREENSHOTS/IAM_User-Creation.png" width="900">

---

## VPC Creation

<img src="IMPLEMENTATION_SCREENSHOTS/VPC-Created.png" width="900">

---

## Public & Private Subnets

<img src="IMPLEMENTATION_SCREENSHOTS/Created-2_subnets-Private&PUblic.png" width="900">

---

## Internet Gateway Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Internet-Gateway-for-VPC.png" width="900">

---

## Route Table Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/route-table.png" width="900">

---

## Security Group Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Created-Security-Groups.png" width="900">

---

## EC2 Instance Creation

<img src="IMPLEMENTATION_SCREENSHOTS/EC2-Instance_Created7Running.png" width="900">

---

## SSH Connectivity

<img src="IMPLEMENTATION_SCREENSHOTS/SSH_AND_EC2-Connectivity.png" width="900">

---

## Linux User Creation

<img src="IMPLEMENTATION_SCREENSHOTS/created-user-in-linux.png" width="900">

---

## Linux Groups Management

<img src="IMPLEMENTATION_SCREENSHOTS/AddedUser-to-Groups.png" width="900">

---

## Linux File Permissions

<img src="IMPLEMENTATION_SCREENSHOTS/Linux-FIles-Permission-Ownership.png" width="900">

---

## Repository Cloning

<img src="IMPLEMENTATION_SCREENSHOTS/ClonedRepo-for-Deploying.png" width="900">

---

## Docker Installation

<img src="IMPLEMENTATION_SCREENSHOTS/Installed-Docker.png" width="900">

---

## Docker Compose Installation

<img src="IMPLEMENTATION_SCREENSHOTS/Docker-COmpose-Installed.png" width="900">

---

## Multi-Container Deployment

<img src="IMPLEMENTATION_SCREENSHOTS/docker-composed-all-containers.png" width="900">

---

## Cron Job Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Created-CronJOB.png" width="900">

---

## Linux Monitoring

<img src="IMPLEMENTATION_SCREENSHOTS/top-command-monitoirng.png" width="900">

---

## Website Deployment

<img src="IMPLEMENTATION_SCREENSHOTS/website-landingpage.png" width="900">

---

## Amazon S3 Bucket

<img src="IMPLEMENTATION_SCREENSHOTS/S3Bucket-created.png" width="900">

---

## CloudWatch Alarm

<img src="IMPLEMENTATION_SCREENSHOTS/Created-Alarm-using-CloudWatch.png" width="900">

---

## AMI Backup Creation

<img src="IMPLEMENTATION_SCREENSHOTS/Created-EC2Instance-Image(AMI)-forBackup.png" width="900">

---

# Challenges Faced

### Docker Build Context Issue

The frontend Docker image initially failed to build because Docker could not access files outside the build context. The Dockerfile was updated to correctly reference the Nginx configuration file.

### Docker Compose Compatibility Issue

The older Docker Compose version was incompatible with the installed Docker Engine version. Upgrading to Docker Compose v2 resolved the deployment issue.

### CORS Configuration Issue

Frontend API requests were blocked due to an incorrect CORS configuration. The allowed origin was updated to match the deployed EC2 public endpoint, restoring communication between frontend and backend services.

---

# Cost Optimization

* EC2 instances can be stopped when not in use.
* S3 provides cost-efficient cloud storage.
* Docker containers optimize resource utilization.
* CloudWatch helps monitor resource consumption.
* AMI backups reduce disaster recovery costs.

---

# Conclusion

The Public Health Disease Surveillance Cloud project successfully demonstrates the practical implementation of AWS Cloud Computing concepts including networking, security, monitoring, storage, backup, Linux administration, Docker containerization, and cloud deployment. The project provides hands-on experience with real-world cloud infrastructure and deployment practices.
