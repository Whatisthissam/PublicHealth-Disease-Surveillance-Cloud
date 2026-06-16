# Public Health Disease Surveillance Cloud

Cloud-based Disease Surveillance Platform deployed on AWS using React, Node.js, Express, MySQL, Docker, and AWS Services.

---

## 📖 Project Overview

The Public Health Disease Surveillance Cloud project is a cloud-native healthcare monitoring platform developed to demonstrate practical implementation of AWS Cloud Computing concepts. The platform provides a centralized environment for disease surveillance while showcasing cloud infrastructure design, networking, Linux administration, monitoring, backup strategies, containerization, and secure application deployment.

The application is hosted on Amazon EC2 and deployed using Docker Compose with separate containers for the frontend, backend, and database services.

---

## 🎯 Objectives

* Design a secure AWS cloud infrastructure.
* Deploy a production-ready web application.
* Demonstrate AWS networking concepts.
* Implement Linux administration tasks.
* Deploy containerized services using Docker.
* Monitor infrastructure using CloudWatch.
* Utilize Amazon S3 cloud storage.
* Implement backup and disaster recovery using AMI.
* Apply security and cost optimization practices.

---

## 🏗️ System Architecture

<p align="center">
  <img src="IMPLEMENTATION_SCREENSHOTS/AWS-Architecture.png" width="1000">
</p>

The Public Health Disease Surveillance Cloud platform is deployed on AWS infrastructure using a containerized architecture. The solution consists of an Amazon EC2 instance hosted inside a Virtual Private Cloud (VPC) and deployed using Docker Compose.

The application is divided into three core services:

* Frontend (React + Vite)
* Backend (Node.js + Express)
* MySQL Database

AWS services such as IAM, S3, CloudWatch, and AMI are integrated to provide secure access management, cloud storage, monitoring, and backup capabilities. Networking components including VPC, Subnet, Internet Gateway, Route Table, and Security Groups ensure secure communication and controlled access to the application.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Cloud & Infrastructure

* AWS EC2
* AWS IAM
* AWS VPC
* AWS S3
* AWS CloudWatch
* AWS AMI

### Deployment

* Docker
* Docker Compose
* Ubuntu Linux

---

## ☁️ AWS Services Used

| AWS Service      | Purpose               |
| ---------------- | --------------------- |
| IAM              | Access Management     |
| VPC              | Network Isolation     |
| Subnet           | Network Segmentation  |
| Internet Gateway | Internet Connectivity |
| Route Table      | Traffic Routing       |
| Security Group   | Firewall Protection   |
| EC2              | Application Hosting   |
| S3               | Cloud Storage         |
| CloudWatch       | Monitoring & Alerts   |
| AMI              | Backup & Recovery     |

---

## 📸 Implementation Screenshots

### IAM User Creation

<img src="IMPLEMENTATION_SCREENSHOTS/IAM_User-Creation.png" width="1000">

### VPC Creation

<img src="IMPLEMENTATION_SCREENSHOTS/VPC-Created.png" width="1000">

### Public & Private Subnets

<img src="IMPLEMENTATION_SCREENSHOTS/Created-2_subnets-Private&PUblic.png" width="1000">

### Internet Gateway Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Internet-Gateway-for-VPC.png" width="1000">

### Route Table Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/route-table.png" width="1000">

### Security Group Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Created-Security-Groups.png" width="1000">

### EC2 Instance Creation

<img src="IMPLEMENTATION_SCREENSHOTS/EC2-Instance_Created7Running.png" width="1000">

### SSH Connectivity

<img src="IMPLEMENTATION_SCREENSHOTS/SSH_AND_EC2-Connectivity.png" width="1000">

### Linux User Creation

<img src="IMPLEMENTATION_SCREENSHOTS/created-user-in-linux.png" width="1000">

### Linux Groups Management

<img src="IMPLEMENTATION_SCREENSHOTS/AddedUser-to-Groups.png" width="1000">

### Linux File Permissions & Ownership

<img src="IMPLEMENTATION_SCREENSHOTS/Linux-FIles-Permission-Ownership.png" width="1000">

### Repository Cloning

<img src="IMPLEMENTATION_SCREENSHOTS/ClonedRepo-for-Deploying.png" width="1000">

### Docker Installation

<img src="IMPLEMENTATION_SCREENSHOTS/Installed-Docker.png" width="1000">

### Docker Compose Installation

<img src="IMPLEMENTATION_SCREENSHOTS/Docker-COmpose-Installed.png" width="1000">

### Multi-Container Deployment

<img src="IMPLEMENTATION_SCREENSHOTS/docker-composed-all-containers.png" width="1000">

### Cron Job Configuration

<img src="IMPLEMENTATION_SCREENSHOTS/Created-CronJOB.png" width="1000">

### Linux Monitoring

<img src="IMPLEMENTATION_SCREENSHOTS/top-command-monitoirng.png" width="1000">

### Application Deployment

<img src="IMPLEMENTATION_SCREENSHOTS/website-landingpage.png" width="1000">

### Amazon S3 Bucket

<img src="IMPLEMENTATION_SCREENSHOTS/S3Bucket-created.png" width="1000">

### CloudWatch Monitoring

<img src="IMPLEMENTATION_SCREENSHOTS/Created-Alarm-using-CloudWatch.png" width="1000">

### AMI Backup Creation

<img src="IMPLEMENTATION_SCREENSHOTS/Created-EC2Instance-Image(AMI)-forBackup.png" width="1000">

---

## ⚡ Challenges Faced

### Docker Build Context Issue

The frontend image initially failed to build because Docker could not access files outside the build context. The Dockerfile was updated to correctly reference the Nginx configuration file.

### Docker Compose Compatibility Issue

The older Docker Compose version was incompatible with the installed Docker Engine version. Upgrading to Docker Compose v2 resolved the deployment issue.

### CORS Configuration Issue

Frontend API requests were blocked due to an incorrect CORS configuration. The allowed origin was updated to match the deployed EC2 endpoint, restoring communication between frontend and backend services.

---

## 💰 Cost Optimization

* Stop EC2 instances when not in use.
* Use S3 for scalable and cost-efficient storage.
* Utilize Docker containers for efficient resource usage.
* Monitor resources using CloudWatch.
* Maintain AMI backups for disaster recovery.
* Use a single EC2 instance during development and testing to reduce infrastructure costs.

---

## 📚 Learning Outcomes

Through this project, practical experience was gained in:

* AWS Cloud Infrastructure Design
* Cloud Networking Concepts
* Linux Administration
* Docker & Containerization
* Cloud Monitoring & Logging
* Cloud Storage Services
* Backup & Disaster Recovery
* Real-World Deployment Troubleshooting
* Secure Cloud Application Hosting

---

## Conclusion

The Public Health Disease Surveillance Cloud project successfully demonstrates the practical implementation of AWS Cloud Computing concepts including networking, security, monitoring, storage, backup, Linux administration, Docker containerization, and cloud deployment. The project provided hands-on experience with real-world AWS infrastructure and deployment practices while showcasing a complete cloud-native application architecture.
