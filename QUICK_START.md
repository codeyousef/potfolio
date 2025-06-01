# Quick Start: Deploy Portfolio to GCP

## ⚡ TL;DR - Steps to Deploy

1. **Run the setup script:**
   ```bash
   chmod +x setup-gcp.sh
   ./setup-gcp.sh
   ```

2. **Add GitHub Secrets:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add all secrets from the script output
   - Copy `key.json` content to `GCP_SA_KEY` secret

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add GCP deployment configuration"
   git push origin main
   ```

4. **Access your deployed app:**
   - Your app will be available at the VM external IP shown in the setup script
   - GitHub Actions will handle testing and deployment automatically

## 📁 Files Added for Deployment

### Production Configuration:
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline
- `backend/Dockerfile.prod` - Production Docker config for Django
- `docker-compose.prod.yml` - Production docker-compose
- `nginx.conf` - Nginx reverse proxy configuration
- `.env.prod.example` - Production environment template

### Setup Scripts:
- `setup-gcp.sh` - Automated GCP setup script
- `DEPLOYMENT_GUIDE.md` - Detailed deployment documentation

## 🔄 CI/CD Pipeline

Your GitHub Actions workflow will:

1. **On every push/PR:**
   - Run frontend tests (ESLint + Vitest)
   - Run backend tests (Django test suite)

2. **On main branch push (if tests pass):**
   - Build Docker images for frontend and backend
   - Push images to Google Container Registry
   - Deploy to your GCP VM
   - Run database migrations
   - Restart services

## 🎯 Your Stack Overview

**Current Setup:**
- **Frontend**: Vite + React + TypeScript + Three.js + Tailwind CSS
- **Backend**: Django + Django REST Framework + PostgreSQL
- **Infrastructure**: Docker containers on GCP Compute Engine
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx

**Production Features:**
- Automated testing before deployment
- Zero-downtime deployments
- Static file serving via Nginx
- Database migrations on deploy
- Container health checks
- Automatic SSL (when domain is configured)

## 🌐 Post-Deployment

After successful deployment:

1. **Access your app**: `http://YOUR-VM-IP`
2. **Django Admin**: `http://YOUR-VM-IP/admin`
3. **API**: `http://YOUR-VM-IP/api`

## 🔧 Common Next Steps

1. **Add a domain name:**
   - Point your domain to the VM IP
   - Update `DJANGO_ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` secrets
   - Set up SSL with Let's Encrypt

2. **Monitor your app:**
   ```bash
   # SSH into VM
   gcloud compute ssh portfolio-vm --zone=us-central1-a
   
   # Check container status
   docker ps
   
   # View logs
   docker-compose logs -f
   ```

3. **Scale for production:**
   - Upgrade VM machine type
   - Use Cloud SQL for managed database
   - Add Cloud CDN for static files
   - Set up monitoring and alerting

## 💡 Tips

- **Development**: Keep using `docker-compose up` locally
- **Production**: All deployments happen via GitHub push to main
- **Environment**: Local uses `.env`, production uses GitHub secrets
- **Logs**: Available in GitHub Actions and on the VM via `docker-compose logs`
- **Updates**: Just push to main branch - automatic deployment!

## 🆘 Need Help?

Check `DEPLOYMENT_GUIDE.md` for detailed explanations and troubleshooting steps.

---

**Ready to deploy? Run `./setup-gcp.sh` and follow the prompts!** 🚀
