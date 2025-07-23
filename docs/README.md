Last redeploy test: July 23, 2025
# Persona Centric Financial Platform

AI-powered financial advisory platform connecting clients with professional advisors.

## 🚀 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: PostgreSQL (Railway)

## 📁 Project Structure

```
web_PersonaCentric/
├── client/                 # React frontend (Vercel deployment)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend (Railway deployment)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── package.json           # Root package.json (backend dependencies)
└── railway.json          # Railway deployment config
```

## 🛠️ Development

### Backend Setup
```bash
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Frontend
- API proxy configured to Railway backend
- No additional environment variables needed

## 📚 Documentation

- `DATABASE_SCHEMA.md` - Database structure and relationships
- `WEBSITE_OVERVIEW.md` - Platform features and functionality
- `ROLE_SYSTEM.md` - User roles and permissions
- `SUBSCRIPTION_SYSTEM.md` - Subscription management
- `PAYMENT_SYSTEM.md` - Payment processing
- `CONTEST_SYSTEM.md` - Contest and rewards system
- `ACCESS_CODE_SYSTEM.md` - Access code management

## 🔐 Security

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS configuration

## 🎨 Frontend Features

- Responsive design with Tailwind CSS
- Multi-language support (Chinese/English)
- Role-based dashboards
- Real-time notifications
- Interactive components

## 🔌 API Endpoints

- Authentication: `/api/auth/*`
- Dashboard: `/api/dashboard`
- Users: `/api/users/*`
- Payments: `/api/payments/*`
- Events: `/api/events/*`
- Contests: `/api/contests/*`
- Blogs: `/api/blogs/*`
- AI Services: `/api/ai/*` 