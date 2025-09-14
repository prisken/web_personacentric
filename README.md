# PersonaCentric - Financial Advisor Matching Platform

A modern web platform that connects clients with financial advisors through intelligent matching algorithms and comprehensive profiles.

## 🚀 Features

### Core Functionality
- **Agent-Client Matching System**: AI-powered quiz-based matching algorithm
- **Agent Profiles**: Comprehensive financial advisor profiles with expertise areas
- **User Management**: Role-based access control (Admin, Agent, Client)
- **Event Management**: Financial events and webinars
- **Blog System**: Educational content and financial insights
- **Contest System**: Interactive financial challenges
- **Multi-language Support**: English and Traditional Chinese

### Technical Features
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Real-time Matching**: Weighted algorithm for optimal agent-client pairing
- **Image Upload**: Cloudinary integration for profile and event images
- **Database Management**: Sequelize ORM with SQLite/PostgreSQL support
- **Authentication**: JWT-based secure authentication
- **Admin Dashboard**: Comprehensive management interface

## 🏗️ Project Structure

```
web_PersonaCentric/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── docs/                # Documentation
├── migrations/          # Database migrations
└── config/             # Global configuration
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM
- **SQLite/PostgreSQL** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prisken/web_personacentric.git
   cd web_personacentric
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Configure your environment variables
   ```

4. **Database setup**
   ```bash
   cd server
   npm run migrate
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

## 📱 Key Pages

- **Home**: Landing page with platform overview
- **Agent Matching**: Quiz-based agent matching system
- **All Agents**: Browse all available financial advisors
- **Admin Dashboard**: User and content management
- **Events**: Financial events and webinars
- **Blogs**: Educational content
- **Contests**: Interactive challenges

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_URL` - Cloudinary configuration
- `PORT` - Server port (default: 5000)

### Database
- **Development**: SQLite (file-based)
- **Production**: PostgreSQL (Railway deployment)

## 🚀 Deployment

### Railway Deployment
The project is configured for Railway deployment with:
- Automatic database migrations
- Health check endpoints
- Environment variable management

### Manual Deployment
1. Set up production environment variables
2. Run database migrations
3. Build frontend: `cd client && npm run build`
4. Start production server: `npm start`

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:
- System architecture overview
- Database schema documentation
- API documentation
- Feature specifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. # Trigger Vercel deployment after revert to commit 13d2916
# Trigger fresh deployment
