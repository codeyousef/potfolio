# GCP Deployment Guide for Portfolio Project

This guide will help you deploy your full-stack portfolio (Vite + React frontend + Django backend) to Google Cloud Platform with automated CI/CD.

## Architecture Overview

- **Frontend**: Vite + React + TypeScript + Three.js + Tailwind
- **Backend**: Django + Django REST Framework + PostgreSQL
- **Deployment**: Docker containers on GCP Compute Engine or Cloud Run
- **CI/CD**: GitHub Actions for automated testing and deployment

## Prerequisites

1. Google Cloud Platform account
2. GitHub repository
3. Domain name (optional but recommended)

## Part 1: GCP Setup

### 1. Create GCP Project

```bash
# Install gcloud CLI first if you haven't
# Then login and create project
gcloud auth login
gcloud projects create your-portfolio-project-id
gcloud config set project your-portfolio-project-id
```

### 2. Enable Required APIs

```bash
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable sql.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Create a PostgreSQL Database

#### Option A: Cloud SQL (Recommended for production)
```bash
gcloud sql instances create portfolio-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1

gcloud sql databases create portfolio --instance=portfolio-db

# Create user
gcloud sql users create portfolio-user --instance=portfolio-db --password=your-secure-password
```

#### Option B: PostgreSQL on Compute Engine (Cheaper)
We'll use the containerized PostgreSQL from docker-compose.

### 4. Create a Compute Engine VM (if not using Cloud Run)

```bash
gcloud compute instances create portfolio-vm \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=cos-stable \
    --image-project=cos-cloud \
    --boot-disk-size=20GB \
    --tags=http-server,https-server

# Enable HTTP/HTTPS traffic
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --tags http-server

gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --tags https-server
```

### 5. Create Service Account for GitHub Actions

```bash
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding your-portfolio-project-id \
    --member="serviceAccount:github-actions@your-portfolio-project-id.iam.gserviceaccount.com" \
    --role="roles/compute.admin"

gcloud projects add-iam-policy-binding your-portfolio-project-id \
    --member="serviceAccount:github-actions@your-portfolio-project-id.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding your-portfolio-project-id \
    --member="serviceAccount:github-actions@your-portfolio-project-id.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# Create and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@your-portfolio-project-id.iam.gserviceaccount.com
```

## Part 2: GitHub Setup

### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```
GCP_PROJECT_ID: your-portfolio-project-id
GCP_SA_KEY: (paste entire content of key.json file)
GCP_VM_NAME: portfolio-vm

# Database secrets
POSTGRES_USER: portfolio-user
POSTGRES_PASSWORD: your-secure-password
POSTGRES_DB: portfolio

# Django secrets
DJANGO_SECRET_KEY: (generate with: python -c "import secrets; print(secrets.token_urlsafe(50))")
DJANGO_ALLOWED_HOSTS: your-domain.com,your-vm-external-ip

# Frontend secrets
VITE_API_URL: https://your-domain.com/api
CORS_ALLOWED_ORIGINS: https://your-domain.com
```

### 2. Get VM External IP

```bash
gcloud compute instances describe portfolio-vm --zone=us-central1-a --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```

Add this IP to your `DJANGO_ALLOWED_HOSTS` secret.

## Part 3: Initial Deployment

### 1. SSH into your VM and prepare

```bash
gcloud compute ssh portfolio-vm --zone=us-central1-a

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p ~/portfolio
```

### 2. Push to GitHub

Commit and push all the changes we made:

```bash
git add .
git commit -m "Add GCP deployment configuration"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run frontend tests (lint + vitest)
2. Run backend tests (Django tests)
3. Build Docker images
4. Deploy to your GCP VM

## Part 4: Domain Setup (Optional)

### 1. Point your domain to the VM IP

Create an A record pointing to your VM's external IP.

### 2. Set up SSL with Let's Encrypt

SSH into your VM and run:

```bash
# Update nginx.conf for SSL
sudo apt update
sudo apt install certbot

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Part 5: Monitoring and Maintenance

### 1. Check deployment status

```bash
# SSH into VM
gcloud compute ssh portfolio-vm --zone=us-central1-a

# Check running containers
docker ps

# View logs
docker-compose logs frontend
docker-compose logs backend
```

### 2. Database migrations

Django migrations will run automatically on deployment, but you can run them manually:

```bash
docker-compose exec backend python manage.py migrate
```

### 3. Create Django superuser

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Alternative: Cloud Run Deployment

If you prefer serverless deployment, enable the Cloud Run job in the GitHub Actions workflow by changing `&& false` to `&& true` in the deploy-cloud-run job condition.

Cloud Run benefits:
- Pay only for requests
- Auto-scaling
- Fully managed

Cloud Run limitations:
- Stateless (need Cloud SQL for database)
- Cold starts
- More complex file storage

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Make sure ports 80/443 are open in GCP firewall
2. **Database connection**: Check PostgreSQL container is running and accessible
3. **Environment variables**: Verify all secrets are correctly set in GitHub
4. **Docker build fails**: Check Dockerfile syntax and dependencies
5. **CORS errors**: Ensure CORS_ALLOWED_ORIGINS includes your domain

### Useful Commands:

```bash
# Check VM logs
gcloud compute instances get-serial-port-output portfolio-vm --zone=us-central1-a

# SSH into VM
gcloud compute ssh portfolio-vm --zone=us-central1-a

# View container logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update deployment
git push origin main  # This triggers automatic deployment
```

## Cost Optimization

- Use `e2-micro` or `f1-micro` for development
- Consider Cloud Run for variable traffic
- Use committed use discounts for production
- Monitor usage with Cloud Monitoring

Your portfolio will be accessible at your VM's external IP or your custom domain once deployed!
