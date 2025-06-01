#!/bin/bash

# GCP Deployment Setup Script
# Run this script to set up your GCP environment for deployment

set -e

echo "🚀 Portfolio GCP Deployment Setup"
echo "================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty"
    exit 1
fi

echo "📋 Setting up project: $PROJECT_ID"

# Set project
gcloud config set project $PROJECT_ID

# Enable APIs
echo "🔧 Enabling required APIs..."
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable sql.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create service account
echo "👤 Creating service account for GitHub Actions..."
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Service Account" || true

# Grant permissions
echo "🔑 Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# Create key
echo "🔐 Creating service account key..."
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Create VM
echo "💻 Creating Compute Engine VM..."
gcloud compute instances create portfolio-vm \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=cos-stable \
    --image-project=cos-cloud \
    --boot-disk-size=20GB \
    --tags=http-server,https-server || echo "VM might already exist"

# Create firewall rules
echo "🔥 Setting up firewall rules..."
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0 \
    --tags http-server || echo "HTTP rule might already exist"

gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --source-ranges 0.0.0.0/0 \
    --tags https-server || echo "HTTPS rule might already exist"

# Get VM external IP
echo "🌐 Getting VM external IP..."
EXTERNAL_IP=$(gcloud compute instances describe portfolio-vm --zone=us-central1-a --format="get(networkInterfaces[0].accessConfigs[0].natIP)")

# Generate Django secret key
echo "🔑 Generating Django secret key..."
DJANGO_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null || openssl rand -base64 50)

# Generate database password
DB_PASSWORD=$(openssl rand -base64 32)

echo ""
echo "✅ Setup completed successfully!"
echo "================================="
echo ""
echo "📋 GitHub Secrets to Add:"
echo "========================"
echo "GCP_PROJECT_ID: $PROJECT_ID"
echo "GCP_SA_KEY: (copy content from key.json file)"
echo "GCP_VM_NAME: portfolio-vm"
echo ""
echo "POSTGRES_USER: portfolio_user"
echo "POSTGRES_PASSWORD: $DB_PASSWORD"
echo "POSTGRES_DB: portfolio"
echo ""
echo "DJANGO_SECRET_KEY: $DJANGO_SECRET_KEY"
echo "DJANGO_ALLOWED_HOSTS: $EXTERNAL_IP,your-domain.com"
echo ""
echo "VITE_API_URL: http://$EXTERNAL_IP/api"
echo "CORS_ALLOWED_ORIGINS: http://$EXTERNAL_IP"
echo ""
echo "🌐 Your VM External IP: $EXTERNAL_IP"
echo ""
echo "📝 Next steps:"
echo "1. Copy the content of key.json file and add as GCP_SA_KEY secret in GitHub"
echo "2. Add all the above secrets to your GitHub repository"
echo "3. Update DJANGO_ALLOWED_HOSTS and VITE_API_URL with your domain if you have one"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "⚠️  Important: Keep key.json secure and don't commit it to git!"

# Save secrets to file for reference
cat > .secrets.txt << EOF
# GitHub Secrets for Portfolio Deployment
# Add these to your GitHub repository secrets

GCP_PROJECT_ID=$PROJECT_ID
GCP_VM_NAME=portfolio-vm
POSTGRES_USER=portfolio_user
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=portfolio
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DJANGO_ALLOWED_HOSTS=$EXTERNAL_IP,your-domain.com
VITE_API_URL=http://$EXTERNAL_IP/api
CORS_ALLOWED_ORIGINS=http://$EXTERNAL_IP

# VM External IP: $EXTERNAL_IP
EOF

echo "💾 Secrets saved to .secrets.txt for your reference"
echo "🚨 Remember to add .secrets.txt to .gitignore!"
