# Deployment Guide

## Frontend (Vercel)

### Setup
1. Connect your GitHub repository to Vercel
2. Set build directory to `client`
3. Set build command to `npm run build`
4. Set output directory to `build`

### Environment Variables
- No additional environment variables needed
- API proxy is configured in `client/package.json`

### Build Settings
- **Framework Preset**: Create React App
- **Node.js Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `build`

## Backend (Railway)

### Setup
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Node.js project
3. Set the start command to `npm start`

### Environment Variables
```env
PORT=5001
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Database Setup
1. Add PostgreSQL service in Railway
2. Railway will automatically provide `DATABASE_URL`
3. Run migrations on first deploy

### Health Check
- Railway will use the health check endpoint: `/api/health`
- Configured in `railway.json`

## Domain Configuration

### Frontend (Vercel)
- Custom domain can be configured in Vercel dashboard
- SSL certificate is automatically provisioned

### Backend (Railway)
- Railway provides a default domain
- Custom domain can be configured in Railway dashboard

## Environment-Specific Configurations

### Development
```bash
# Backend
npm run dev

# Frontend
cd client && npm start
```

### Production
- Vercel and Railway handle production builds automatically
- Environment variables are set in respective dashboards 