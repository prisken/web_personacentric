# Persona Centric Financial Platform

A comprehensive financial platform connecting clients with expert agents, featuring multilingual support, role-based access control, point systems, contests, and AI-powered content creation.

## 🚀 Features

### Core Platform
- **Multilingual Support**: English and Traditional Chinese with Chinese-first design
- **Role-Based Access Control**: Admin, Agent, and Client roles with specific permissions
- **Authentication System**: JWT-based authentication with email verification
- **Responsive Design**: Mobile-first approach with modern UI/UX

### User Management
- **User Registration & Login**: Secure authentication with email verification
- **Profile Management**: Comprehensive user profiles with preferences
- **Role Management**: Dynamic role assignment and permission control
- **Subscription System**: Monthly/yearly subscriptions with grace period handling

### Financial Services
- **Agent-Client Matching**: AI-powered matching based on personality and financial needs
- **Event Management**: Workshops, seminars, consultations, and webinars
- **Point System**: Reward system for engagement and content creation
- **Contest System**: Monthly content contests with prizes and recognition

### Content & Education
- **Blog System**: SEO-optimized blog with multilingual content
- **AI Content Creation**: OpenAI-powered content generation with usage limits
- **Educational Resources**: Financial education materials and guides
- **Insurance Integration**: Subtle insurance product integration

### Admin Features
- **Dashboard Analytics**: Comprehensive analytics and reporting
- **User Management**: Admin tools for user management and support
- **Content Moderation**: Blog and contest submission moderation
- **Access Code System**: Admin-granted unlimited access codes

### Technical Features
- **Real-time Notifications**: WebSocket-based real-time notifications
- **Payment Integration**: Stripe payment processing
- **File Upload**: Secure file upload with image optimization
- **SEO Optimization**: Comprehensive SEO with structured data
- **Performance Monitoring**: Web vitals tracking and optimization

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Sequelize ORM
- **Redis** for caching and session management
- **JWT** for authentication
- **Stripe** for payment processing
- **OpenAI** for AI content generation
- **Twilio** for SMS notifications
- **Nodemailer** for email notifications

### Frontend
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **React Query** for server state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Development Tools
- **ESLint** and **Prettier** for code formatting
- **Jest** and **React Testing Library** for testing
- **Webpack** for bundling
- **Babel** for transpilation

## 📁 Project Structure

```
web_PersonaCentric/
├── server/                    # Backend server
│   ├── config/               # Database and app configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   └── index.js             # Server entry point
├── client/                   # Frontend React app
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main app component
│   └── package.json         # Frontend dependencies
├── docs/                     # Documentation
├── scripts/                  # Build and deployment scripts
└── package.json             # Root dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/persona-centric.git
   cd persona-centric
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp env.example .env
   cp client/.env.example client/.env
   
   # Configure environment variables
   # Edit .env files with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb persona_centric_dev
   
   # Run migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Start backend server (from root)
   npm run dev:server
   
   # Start frontend server (from root)
   npm run dev:client
   
   # Or start both simultaneously
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000/api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=persona_centric_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GA_ID=your_google_analytics_id
REACT_APP_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **agents**: Agent-specific information
- **events**: Financial events and workshops
- **blog_posts**: Blog content with SEO optimization
- **contests**: Monthly content contests
- **points_transactions**: Point system tracking
- **subscriptions**: Payment and subscription management
- **access_codes**: Admin-granted access codes

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Trust and professionalism
- **Secondary**: Gray (#64748b) - Neutral and balanced
- **Accent**: Purple (#d946ef) - Innovation and creativity
- **Success**: Green (#22c55e) - Positive actions
- **Warning**: Yellow (#f59e0b) - Cautions and alerts
- **Error**: Red (#ef4444) - Errors and critical actions
- **Financial**: Teal (#14b8a6) - Financial services

### Typography
- **Display**: Poppins - Headers and titles
- **Body**: Inter - Body text and UI elements
- **Mono**: JetBrains Mono - Code and technical content

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission system
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers and protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client && npm run build

# Build backend
cd ../server && npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

### Environment-Specific Configurations
- **Development**: Hot reloading, debug logging
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds, error monitoring

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Testing
```bash
# Run all tests
cd client && npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance Optimization

### Backend
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis-based caching for frequently accessed data
- **Compression**: Gzip compression for API responses
- **Connection Pooling**: Efficient database connection management

### Frontend
- **Code Splitting**: Lazy loading for better initial load times
- **Image Optimization**: WebP format and responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Service worker for offline functionality

## 🔍 SEO Features

- **Meta Tags**: Comprehensive meta tag management
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Open Graph**: Social media sharing optimization
- **Canonical URLs**: Proper canonical URL handling
- **Performance**: Core Web Vitals optimization

## 📊 Analytics & Monitoring

- **Google Analytics**: User behavior tracking
- **Facebook Pixel**: Conversion tracking
- **Error Monitoring**: Comprehensive error tracking
- **Performance Monitoring**: Web vitals and performance metrics
- **User Analytics**: Engagement and conversion tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@personacentric.com
- **Documentation**: [docs.personacentric.com](https://docs.personacentric.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/persona-centric/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform implementation
- ✅ User authentication and roles
- ✅ Basic event management
- ✅ Point system foundation

### Phase 2 (Next)
- 🔄 Advanced AI matching algorithms
- 🔄 Mobile app development
- 🔄 Advanced analytics dashboard
- 🔄 Integration with financial APIs

### Phase 3 (Future)
- 📋 Blockchain integration
- 📋 Advanced AI features
- 📋 International expansion
- 📋 Enterprise features

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **OpenAI** for AI capabilities
- **Stripe** for payment processing
- **PostgreSQL** for the reliable database

---

**Built with ❤️ by the Persona Centric Team** 