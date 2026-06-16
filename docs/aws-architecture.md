# AWS Architecture Guide — PublicHealth Disease Surveillance Cloud

## VPC Architecture

```
VPC: 10.0.0.0/16
├── Public Subnet A (10.0.1.0/24) — us-south-1a
│   └── Application Load Balancer
├── Public Subnet B (10.0.2.0/24) — us-south-1b
│   └── ALB (Multi-AZ)
├── Private Subnet A (10.0.10.0/24) — us-south-1a
│   └── EC2: Backend API (t3.medium)
├── Private Subnet B (10.0.11.0/24) — us-south-1b
│   └── EC2: Backend API (Auto Scaling)
├── DB Subnet A (10.0.20.0/24) — us-south-1a
│   └── RDS MySQL Primary
└── DB Subnet B (10.0.21.0/24) — us-south-1b
    └── RDS MySQL Read Replica
```

## Security Groups

### sg-alb (Load Balancer)
- Inbound: 80 (HTTP), 443 (HTTPS) from 0.0.0.0/0
- Outbound: 3001 to sg-backend

### sg-backend (EC2 API Servers)
- Inbound: 3001 from sg-alb only
- Inbound: 22 (SSH) from sg-bastion only
- Outbound: 3306 to sg-rds

### sg-rds (Database)
- Inbound: 3306 from sg-backend only
- No public access

### sg-bastion (Jump Server)
- Inbound: 22 from specific admin IPs only

## IAM Roles

### ec2-publichealth-role
Attached to EC2 instances:
- CloudWatchAgentServerPolicy
- AmazonSSMManagedInstanceCore
- Custom: SecretsManagerReadAccess (for DB credentials)

## CloudWatch Alarms

| Alarm | Metric | Threshold | Action |
|-------|--------|-----------|--------|
| HighCPU | EC2 CPUUtilization | >80% 5min | Scale Out |
| LowCPU | EC2 CPUUtilization | <20% 15min | Scale In |
| DBConnections | RDS DatabaseConnections | >80 | Alert SNS |
| DBStorage | RDS FreeStorageSpace | <5GB | Alert SNS |
| APILatency | ALB TargetResponseTime | >2s | Alert SNS |
| Error5xx | ALB HTTPCode_5XX | >10/min | Alert SNS |

## Auto Scaling Policy

```
Min: 1 instance
Desired: 2 instances
Max: 5 instances
Scale Out: +1 when CPU > 70% for 5 minutes
Scale In: -1 when CPU < 20% for 15 minutes
Cooldown: 300 seconds
```

## Cost Estimate (Production)

| Service | Config | Monthly Cost |
|---------|--------|-------------|
| EC2 (x2 t3.medium RI) | 1-year reserved | ~$47 |
| RDS (db.t3.micro RI) | 1-year reserved | ~$18 |
| ALB | ~100K requests/day | ~$20 |
| S3 + CloudFront | 10GB data | ~$5 |
| CloudWatch | Basic metrics | ~$3 |
| NAT Gateway | Moderate traffic | ~$15 |
| **Total** | | **~$108/month** |

## S3 Bucket Policy (Frontend)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::publichealth-surveillance-assets/*"
    }
  ]
}
```

## RDS Parameter Group

Key MySQL parameters for production:
- `max_connections`: 200
- `innodb_buffer_pool_size`: 75% of RAM
- `slow_query_log`: ON
- `long_query_time`: 2
- `general_log`: OFF (production)
