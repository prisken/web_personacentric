# Frontend Development Plan

## 🎯 **Project Overview**

**Framework**: React 18 with TypeScript  
**Styling**: Tailwind CSS with custom design system  
**State Management**: React Context + Zustand  
**Routing**: React Router v6  
**Language**: Chinese-first with English support  
**Architecture**: Component-based with custom hooks  

---

## 📁 **Project Structure**

```
client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   └── Notification/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard/
│   │   │   ├── AgentDashboard/
│   │   │   └── ClientDashboard/
│   │   ├── events/
│   │   │   ├── EventList/
│   │   │   ├── EventCard/
│   │   │   ├── EventDetail/
│   │   │   └── EventForm/
│   │   ├── blog/
│   │   │   ├── BlogList/
│   │   │   ├── BlogCard/
│   │   │   ├── BlogDetail/
│   │   │   ├── BlogEditor/
│   │   │   ├── BlogCategories/
│   │   │   └── BlogSearch/
│   │   ├── matching/
│   │   │   ├── AgentMatchingQuiz/
│   │   │   ├── QuizQuestion/
│   │   │   ├── AgentRecommendation/
│   │   │   └── MatchingResults/
│   │   ├── points/
│   │   │   ├── PointBalance/
│   │   │   ├── PointHistory/
│   │   │   └── PointRewards/
│   │   ├── contests/
│   │   │   ├── ContestList/
│   │   │   ├── ContestCard/
│   │   │   ├── ContestSubmission/
│   │   │   └── ContestVoting/
│   │   ├── payment/
│   │   │   ├── PaymentOptions/
│   │   │   ├── AccessCodeForm/
│   │   │   ├── SubscriptionStatus/
│   │   │   └── PricingPlans/
│   │   ├── ai/
│   │   │   ├── AIContentCreator/
│   │   │   ├── AITrialForm/
│   │   │   └── ConversionPrompts/
│   │   └── admin/
│   │       ├── UserManagement/
│   │       ├── AccessCodeManagement/
│   │       ├── ContestManagement/
│   │       ├── BlogManagement/
│   │       ├── BlogEditor/
│   │       ├── BlogCategories/
│   │       └── Analytics/
│   ├── pages/
│   │   ├── HomePage/
│   │   ├── AboutPage/
│   │   ├── LoginPage/
│   │   ├── RegisterPage/
│   │   ├── DashboardPage/
│   │   ├── EventsPage/
│   │   ├── ContestsPage/
│   │   ├── ProfilePage/
│   │   ├── AdminPage/
│   │   ├── PricingPage/
│   │   ├── AITrialPage/
│   │   ├── AgentMatchingPage/
│   │   ├── BlogPage/
│   │   └── AdminBlogPage/
│   ├── contexts/
│   │   ├── LanguageContext/
│   │   ├── AuthContext/
│   │   ├── NotificationContext/
│   │   └── ThemeContext/
│   ├── hooks/
│   │   ├── useAuth/
│   │   ├── useLanguage/
│   │   ├── useNotification/
│   │   ├── useApi/
│   │   └── useLocalStorage/
│   ├── services/
│   │   ├── api/
│   │   │   ├── authApi/
│   │   │   ├── eventApi/
│   │   │   ├── contestApi/
│   │   │   ├── pointApi/
│   │   │   └── paymentApi/
│   │   ├── storage/
│   │   └── validation/
│   ├── utils/
│   │   ├── translations.js
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── tailwind.config.js
│   ├── types/
│   │   ├── auth.ts
│   │   ├── events.ts
│   │   ├── contests.ts
│   │   ├── points.ts
│   │   └── payment.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;

/* Secondary Colors */
--secondary-50: #f0fdf4;
--secondary-100: #dcfce7;
--secondary-500: #22c55e;
--secondary-600: #16a34a;
--secondary-700: #15803d;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### **Typography**
```css
/* Font Families */
--font-sans: 'Inter', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

### **Spacing & Layout**
```css
/* Spacing Scale */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;

/* Breakpoints */
--sm: 640px;
--md: 768px;
--lg: 1024px;
--xl: 1280px;
--2xl: 1536px;
```

---

## 🔧 **Core Components**

### **1. Common Components**

#### **Button Component**
```typescript
// components/common/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};
```

#### **Input Component**
```typescript
// components/common/Input/Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

### **2. Layout Components**

#### **Header Component**
```typescript
// components/layout/Header/Header.tsx
const Header: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app.name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="text-gray-700 hover:text-primary-600">
              {t('nav.events')}
            </Link>
            <Link to="/contests" className="text-gray-700 hover:text-primary-600">
              {t('nav.contests')}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                {t('nav.dashboard')}
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

### **3. Authentication Components**

#### **Login Form**
```typescript
// components/auth/LoginForm/LoginForm.tsx
const LoginForm: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      showNotification('success', t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.login')}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
            required
          />
          
          <Input
            type="password"
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
            required
          />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {t('auth.rememberMe')}
              </span>
            </label>
            
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          
          {errors.general && (
            <div className="text-red-600 text-sm text-center">
              {errors.general}
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            {t('auth.login')}
          </Button>
        </form>
      </div>
    </div>
  );
};
```

### **4. Dashboard Components**

#### **Admin Dashboard**
```typescript
// components/dashboard/AdminDashboard/AdminDashboard.tsx
const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAgents: 0,
    totalEvents: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/activity')
      ]);
      
      setStats(statsData.data);
      setRecentActivity(activityData.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('admin.stats.totalUsers')}
          value={stats.totalUsers}
          icon="users"
          trend="+12%"
          trendDirection="up"
        />
        <StatCard
          title={t('admin.stats.activeAgents')}
          value={stats.activeAgents}
          icon="agents"
          trend="+5%"
          trendDirection="up"
        />
        <StatCard
          title={t('admin.stats.totalEvents')}
          value={stats.totalEvents}
          icon="events"
          trend="+8%"
          trendDirection="up"
        />
        <StatCard
          title={t('admin.stats.totalRevenue')}
          value={`HKD $${stats.totalRevenue.toLocaleString()}`}
          icon="revenue"
          trend="+15%"
          trendDirection="up"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('admin.quickActions')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/users')}
            className="justify-start"
          >
            <UserIcon className="w-5 h-5 mr-2" />
            {t('admin.manageUsers')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/access-codes')}
            className="justify-start"
          >
            <KeyIcon className="w-5 h-5 mr-2" />
            {t('admin.manageAccessCodes')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/contests')}
            className="justify-start"
          >
            <TrophyIcon className="w-5 h-5 mr-2" />
            {t('admin.manageContests')}
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {t('admin.recentActivity')}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 **State Management**

### **Context Setup**

#### **Language Context**
```typescript
// contexts/LanguageContext.tsx
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh-TW';
  });

  const t = useCallback((key: string, params?: Record<string, any>) => {
    const translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, String(value)),
        translation
      );
    }
    
    return translation;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

#### **Auth Context**
```typescript
// contexts/AuthContext.tsx
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'client';
  status: 'active' | 'suspended' | 'pending';
  language_preference: string;
  points_balance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🎯 **Page Components**

### **Home Page**
```typescript
// pages/HomePage/HomePage.tsx
const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [eventsResponse, contestsResponse] = await Promise.all([
        api.get('/events/featured'),
        api.get('/contests/upcoming')
      ]);
      
      setFeaturedEvents(eventsResponse.data);
      setUpcomingContests(contestsResponse.data);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                {t('home.hero.getStarted')}
              </Button>
              <Button size="lg" variant="outline">
                {t('home.hero.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-up CTA Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary">
              {t('home.cta.becomeMember')}
            </Button>
            <Button size="lg" variant="outline">
              {t('home.cta.tryAI')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('home.featuredEvents')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Contests */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('home.upcomingContests')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
```

### **Pricing Page**
```typescript
// pages/PricingPage/PricingPage.tsx
const PricingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const plans = [
    {
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      description: t('pricing.free.description'),
      features: [
        t('pricing.free.feature1'),
        t('pricing.free.feature2'),
        t('pricing.free.feature3'),
        t('pricing.free.feature4')
      ],
      limitations: [
        t('pricing.free.limitation1'),
        t('pricing.free.limitation2'),
        t('pricing.free.limitation3')
      ],
      buttonText: t('pricing.free.button'),
      variant: 'outline' as const
    },
    {
      name: t('pricing.agent.name'),
      price: t('pricing.agent.price'),
      description: t('pricing.agent.description'),
      features: [
        t('pricing.agent.feature1'),
        t('pricing.agent.feature2'),
        t('pricing.agent.feature3'),
        t('pricing.agent.feature4'),
        t('pricing.agent.feature5'),
        t('pricing.agent.feature6')
      ],
      popular: true,
      buttonText: t('pricing.agent.button'),
      variant: 'primary' as const
    },
    {
      name: t('pricing.unlimited.name'),
      price: t('pricing.unlimited.price'),
      description: t('pricing.unlimited.description'),
      features: [
        t('pricing.unlimited.feature1'),
        t('pricing.unlimited.feature2'),
        t('pricing.unlimited.feature3'),
        t('pricing.unlimited.feature4'),
        t('pricing.unlimited.feature5'),
        t('pricing.unlimited.feature6'),
        t('pricing.unlimited.feature7')
      ],
      buttonText: t('pricing.unlimited.button'),
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, limitationIndex) => (
                  <li key={limitationIndex} className="flex items-start">
                    <XIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span className="text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                size="lg"
                className="w-full"
                onClick={() => handlePlanSelection(plan)}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('pricing.faq.title')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **AI Trial Page**
```typescript
// pages/AITrialPage/AITrialPage.tsx
const AITrialPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'facebook',
    tone: 'professional',
    language: 'zh-TW'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const maxTrials = 5;

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { value: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { value: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon }
  ];

  const tones = [
    { value: 'professional', label: t('aiTrial.tones.professional') },
    { value: 'friendly', label: t('aiTrial.tones.friendly') },
    { value: 'casual', label: t('aiTrial.tones.casual') },
    { value: 'formal', label: t('aiTrial.tones.formal') }
  ];

  const handleGenerate = async () => {
    if (trialCount >= maxTrials) {
      showNotification('error', t('aiTrial.maxTrialsReached'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ai/generate-trial', formData);
      setGeneratedContent(response.data.content);
      setTrialCount(prev => prev + 1);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('aiTrial.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {t('aiTrial.subtitle')}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              {t('aiTrial.trialInfo', { remaining: maxTrials - trialCount })}
            </p>
          </div>
        </div>

        {/* Trial Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('aiTrial.form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label={t('aiTrial.form.topic')}
              placeholder={t('aiTrial.form.topicPlaceholder')}
              value={formData.topic}
              onChange={(value) => setFormData({ ...formData, topic: value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('aiTrial.form.platform')}
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {platforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('aiTrial.form.tone')}
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('aiTrial.form.language')}
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            loading={loading}
            disabled={!formData.topic.trim() || trialCount >= maxTrials}
            className="w-full"
          >
            {t('aiTrial.form.generate')}
          </Button>
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t('aiTrial.generated.title')}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 whitespace-pre-wrap">{generatedContent}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                {t('aiTrial.generated.copy')}
              </Button>
              <Button variant="outline">
                {t('aiTrial.generated.download')}
              </Button>
            </div>
          </div>
        )}

        {/* Conversion CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t('aiTrial.conversion.title')}
          </h3>
          <p className="text-lg mb-6">
            {t('aiTrial.conversion.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              {t('aiTrial.conversion.becomeMember')}
            </Button>
            <Button variant="outline" size="lg">
              {t('aiTrial.conversion.viewPricing')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **Blog Page**
```typescript
// pages/BlogPage/BlogPage.tsx
const BlogPage: React.FC = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const blogCategories = [
    { id: 'investment', name: t('blog.categories.investment'), icon: InvestmentIcon },
    { id: 'insurance', name: t('blog.categories.insurance'), icon: InsuranceIcon },
    { id: 'retirement', name: t('blog.categories.retirement'), icon: RetirementIcon },
    { id: 'savings', name: t('blog.categories.savings'), icon: SavingsIcon },
    { id: 'market-analysis', name: t('blog.categories.marketAnalysis'), icon: MarketIcon },
    { id: 'financial-planning', name: t('blog.categories.financialPlanning'), icon: PlanningIcon }
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog/posts', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: 12
        }
      });
      
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{t('blog.seo.title')}</title>
        <meta name="description" content={t('blog.seo.description')} />
        <meta name="keywords" content={t('blog.seo.keywords')} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('blog.seo.title')} />
        <meta property="og:description" content={t('blog.seo.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('blog.seo.title')} />
        <meta name="twitter:description" content={t('blog.seo.description')} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": t('blog.seo.title'),
            "description": t('blog.seo.description'),
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "PersonaCentric Financial Platform"
            }
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <BlogSearch
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('blog.search.placeholder')}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                onClick={() => handleCategoryChange('all')}
              >
                {t('blog.categories.all')}
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {currentPage === 1 && posts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('blog.featured.title')}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {posts.slice(0, 2).map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      featured={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCategory === 'all' 
                  ? t('blog.latest.title') 
                  : t('blog.category.title', { category: blogCategories.find(c => c.id === selectedCategory)?.name })
                }
              </h2>
              
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {t('blog.noPosts')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      featured={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t('blog.newsletter.title')}
          </h3>
          <p className="text-lg mb-6">
            {t('blog.newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input
              type="email"
              placeholder={t('blog.newsletter.placeholder')}
              className="flex-1 max-w-md"
            />
            <Button variant="secondary">
              {t('blog.newsletter.subscribe')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **Blog Detail Page**
```typescript
// pages/BlogDetailPage/BlogDetailPage.tsx
const BlogDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const [postResponse, relatedResponse] = await Promise.all([
        api.get(`/blog/posts/${id}`),
        api.get(`/blog/posts/${id}/related`)
      ]);
      
      setPost(postResponse.data);
      setRelatedPosts(relatedResponse.data);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('blog.notFound.title')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('blog.notFound.description')}
          </p>
          <Button onClick={() => navigate('/blog')}>
            {t('blog.notFound.backToBlog')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.seo_title || post.title}</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        <meta name="keywords" content={post.seo_keywords} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo_title || post.title} />
        <meta name="twitter:description" content={post.seo_description || post.excerpt} />
        {post.featured_image && (
          <meta name="twitter:image" content={post.featured_image} />
        )}
        
        {/* Article Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featured_image,
            "author": {
              "@type": "Person",
              "name": post.author.name
            },
            "publisher": {
              "@type": "Organization",
              "name": "PersonaCentric Financial Platform"
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

      {/* Article Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: t('blog.breadcrumb.home'), href: '/' },
                { label: t('blog.breadcrumb.blog'), href: '/blog' },
                { label: post.category.name, href: `/blog?category=${post.category.id}` },
                { label: post.title, href: '#' }
              ]}
            />
          </div>

          <div className="text-center">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category.name}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>{post.read_time} {t('blog.readTime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Article Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <ShareIcon className="w-4 h-4 mr-2" />
                  {t('blog.share')}
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  {t('blog.bookmark')}
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <ThumbUpIcon className="w-4 h-4 mr-2" />
                  {post.likes} {t('blog.likes')}
                </Button>
                <Button variant="outline" size="sm">
                  <CommentIcon className="w-4 h-4 mr-2" />
                  {post.comments_count} {t('blog.comments')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('blog.related.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.id}
                post={relatedPost}
                featured={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### **Admin Blog Management Page**
```typescript
// pages/AdminBlogPage/AdminBlogPage.tsx
const AdminBlogPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, published, draft, archived

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, filter]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/blog/posts', {
        params: {
          page: currentPage,
          filter: filter !== 'all' ? filter : undefined,
          limit: 10
        }
      });
      
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm(t('adminBlog.deleteConfirm'))) {
      try {
        await api.delete(`/admin/blog/posts/${postId}`);
        showNotification('success', t('adminBlog.deleteSuccess'));
        fetchBlogPosts();
      } catch (error) {
        showNotification('error', error.message);
      }
    }
  };

  const handlePublishPost = async (postId) => {
    try {
      await api.put(`/admin/blog/posts/${postId}/publish`);
      showNotification('success', t('adminBlog.publishSuccess'));
      fetchBlogPosts();
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const handleUnpublishPost = async (postId) => {
    try {
      await api.put(`/admin/blog/posts/${postId}/unpublish`);
      showNotification('success', t('adminBlog.unpublishSuccess'));
      fetchBlogPosts();
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: t('adminBlog.status.draft'), className: 'bg-gray-100 text-gray-800' },
      published: { label: t('adminBlog.status.published'), className: 'bg-green-100 text-green-800' },
      archived: { label: t('adminBlog.status.archived'), className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('adminBlog.title')}
              </h1>
              <p className="text-gray-600 mt-2">
                {t('adminBlog.subtitle')}
              </p>
            </div>
            
            <Button onClick={handleCreatePost} size="lg">
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('adminBlog.createPost')}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-6">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              {t('adminBlog.filters.all')}
            </Button>
            <Button
              variant={filter === 'published' ? 'primary' : 'outline'}
              onClick={() => setFilter('published')}
            >
              {t('adminBlog.filters.published')}
            </Button>
            <Button
              variant={filter === 'draft' ? 'primary' : 'outline'}
              onClick={() => setFilter('draft')}
            >
              {t('adminBlog.filters.draft')}
            </Button>
            <Button
              variant={filter === 'archived' ? 'primary' : 'outline'}
              onClick={() => setFilter('archived')}
            >
              {t('adminBlog.filters.archived')}
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.title')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.category')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.author')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.publishedAt')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('adminBlog.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {post.featured_image && (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.author.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.published_at ? formatDate(post.published_at) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            {t('adminBlog.actions.edit')}
                          </Button>
                          
                          {post.status === 'draft' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePublishPost(post.id)}
                            >
                              {t('adminBlog.actions.publish')}
                            </Button>
                          )}
                          
                          {post.status === 'published' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnpublishPost(post.id)}
                            >
                              {t('adminBlog.actions.unpublish')}
                            </Button>
                          )}
                          
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            {t('adminBlog.actions.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      {showEditor && (
        <BlogEditor
          post={selectedPost}
          onClose={() => {
            setShowEditor(false);
            setSelectedPost(null);
          }}
          onSave={() => {
            setShowEditor(false);
            setSelectedPost(null);
            fetchBlogPosts();
          }}
        />
      )}
    </div>
  );
};
```

### **Blog Editor Component**
```typescript
// components/admin/BlogEditor/BlogEditor.tsx
const BlogEditor: React.FC<{ post?: any; onClose: () => void; onSave: () => void }> = ({
  post,
  onClose,
  onSave
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category_id: post?.category_id || '',
    featured_image: post?.featured_image || '',
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || '',
    tags: post?.tags || [],
    status: post?.status || 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const statusOptions = [
    { value: 'draft', label: t('adminBlog.status.draft') },
    { value: 'published', label: t('adminBlog.status.published') },
    { value: 'archived', label: t('adminBlog.status.archived') }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/blog/categories');
      setCategories(response.data);
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const handleImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/admin/blog/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({ ...prev, featured_image: response.data.url }));
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (post) {
        await api.put(`/admin/blog/posts/${post.id}`, formData);
        showNotification('success', t('adminBlog.updateSuccess'));
      } else {
        await api.post('/admin/blog/posts', formData);
        showNotification('success', t('adminBlog.createSuccess'));
      }
      onSave();
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'published' }));
    await handleSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {post ? t('adminBlog.editor.editTitle') : t('adminBlog.editor.createTitle')}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('adminBlog.editor.cancel')}
            </Button>
            <Button variant="outline" onClick={handleSave} loading={loading}>
              {t('adminBlog.editor.save')}
            </Button>
            <Button onClick={handlePublish} loading={loading}>
              {t('adminBlog.editor.publish')}
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main Editor */}
            <div className="lg:col-span-2 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.title')}
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                    placeholder={t('adminBlog.editor.titlePlaceholder')}
                    className="text-xl font-bold"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.excerpt')}
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder={t('adminBlog.editor.excerptPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.content')}
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder={t('adminBlog.editor.contentPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 p-6 bg-gray-50 overflow-y-auto">
              <div className="space-y-6">
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.featuredImage')}
                  </label>
                  <ImageUpload
                    currentImage={formData.featured_image}
                    onUpload={handleImageUpload}
                    uploading={imageUploading}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.category')}
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">{t('adminBlog.editor.selectCategory')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('adminBlog.editor.tags')}
                  </label>
                  <TagInput
                    value={formData.tags}
                    onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                    placeholder={t('adminBlog.editor.tagsPlaceholder')}
                  />
                </div>

                {/* SEO Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t('adminBlog.editor.seo.title')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('adminBlog.editor.seo.title')}
                      </label>
                      <Input
                        value={formData.seo_title}
                        onChange={(value) => setFormData(prev => ({ ...prev, seo_title: value }))}
                        placeholder={t('adminBlog.editor.seo.titlePlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('adminBlog.editor.seo.description')}
                      </label>
                      <textarea
                        value={formData.seo_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder={t('adminBlog.editor.seo.descriptionPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('adminBlog.editor.seo.keywords')}
                      </label>
                      <Input
                        value={formData.seo_keywords}
                        onChange={(value) => setFormData(prev => ({ ...prev, seo_keywords: value }))}
                        placeholder={t('adminBlog.editor.seo.keywordsPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **Agent Matching Quiz Page**
```typescript
// pages/AgentMatchingPage/AgentMatchingPage.tsx
const AgentMatchingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendedAgents, setRecommendedAgents] = useState([]);

  const questions = [
    {
      id: 1,
      question: t('agentMatching.questions.personality'),
      options: [
        { value: 'extroverted', label: t('agentMatching.options.extroverted') },
        { value: 'introverted', label: t('agentMatching.options.introverted') },
        { value: 'balanced', label: t('agentMatching.options.balanced') }
      ]
    },
    {
      id: 2,
      question: t('agentMatching.questions.communication'),
      options: [
        { value: 'formal', label: t('agentMatching.options.formal') },
        { value: 'casual', label: t('agentMatching.options.casual') },
        { value: 'mixed', label: t('agentMatching.options.mixed') }
      ]
    },
    {
      id: 3,
      question: t('agentMatching.questions.financial_goals'),
      options: [
        { value: 'short_term', label: t('agentMatching.options.short_term') },
        { value: 'long_term', label: t('agentMatching.options.long_term') },
        { value: 'both', label: t('agentMatching.options.both') }
      ]
    },
    {
      id: 4,
      question: t('agentMatching.questions.risk_tolerance'),
      options: [
        { value: 'conservative', label: t('agentMatching.options.conservative') },
        { value: 'moderate', label: t('agentMatching.options.moderate') },
        { value: 'aggressive', label: t('agentMatching.options.aggressive') }
      ]
    },
    {
      id: 5,
      question: t('agentMatching.questions.investment_experience'),
      options: [
        { value: 'beginner', label: t('agentMatching.options.beginner') },
        { value: 'intermediate', label: t('agentMatching.options.intermediate') },
        { value: 'advanced', label: t('agentMatching.options.advanced') }
      ]
    },
    {
      id: 6,
      question: t('agentMatching.questions.preferred_frequency'),
      options: [
        { value: 'weekly', label: t('agentMatching.options.weekly') },
        { value: 'monthly', label: t('agentMatching.options.monthly') },
        { value: 'quarterly', label: t('agentMatching.options.quarterly') }
      ]
    },
    {
      id: 7,
      question: t('agentMatching.questions.financial_priority'),
      options: [
        { value: 'savings', label: t('agentMatching.options.savings') },
        { value: 'investment', label: t('agentMatching.options.investment') },
        { value: 'insurance', label: t('agentMatching.options.insurance') },
        { value: 'retirement', label: t('agentMatching.options.retirement') }
      ]
    },
    {
      id: 8,
      question: t('agentMatching.questions.decision_style'),
      options: [
        { value: 'analytical', label: t('agentMatching.options.analytical') },
        { value: 'intuitive', label: t('agentMatching.options.intuitive') },
        { value: 'collaborative', label: t('agentMatching.options.collaborative') }
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const response = await api.post('/agents/match-quiz', {
        answers: answers,
        user_id: user?.id
      });
      
      setRecommendedAgents(response.data.recommended_agents);
      setShowResults(true);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAgent = async (agentId: string) => {
    try {
      await api.post('/agents/contact', {
        agent_id: agentId,
        user_id: user?.id
      });
      showNotification('success', t('agentMatching.contactSuccess'));
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('agentMatching.results.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('agentMatching.results.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedAgents.map((agent) => (
              <AgentRecommendationCard
                key={agent.id}
                agent={agent}
                onContact={() => handleContactAgent(agent.id)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
              }}
            >
              {t('agentMatching.results.retakeQuiz')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('agentMatching.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {t('agentMatching.subtitle')}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              {t('agentMatching.progress', { 
                current: currentQuestion + 1, 
                total: questions.length 
              })}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              {t('agentMatching.previous')}
            </Button>
            
            <div className="text-sm text-gray-500">
              {t('agentMatching.question', { 
                current: currentQuestion + 1, 
                total: questions.length 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🚀 **Implementation Strategy**

### **Phase 1: Foundation (Week 1-2)**
- [ ] Project setup and configuration
- [ ] Core components (Button, Input, Modal, etc.)
- [ ] Layout components (Header, Footer, Navigation)
- [ ] Authentication system
- [ ] Language context and translations

### **Phase 2: Core Features (Week 3-4)**
- [ ] Dashboard pages (Admin, Agent, Client)
- [ ] Event management components
- [ ] Contest system components
- [ ] Point system components
- [ ] Payment integration

### **Phase 3: Advanced Features (Week 5-6)**
- [ ] Admin management panels
- [ ] Access code system
- [ ] Notification system
- [ ] Analytics and reporting
- [ ] Mobile responsiveness

### **Phase 4: Polish & Testing (Week 7-8)**
- [ ] Performance optimization
- [ ] Error handling
- [ ] Unit and integration tests
- [ ] Accessibility improvements
- [ ] Final deployment preparation

---

## 📱 **Responsive Design**

### **Mobile-First Approach**
```css
/* Base styles for mobile */
.container {
  padding: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### **Breakpoint Strategy**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1535px
- **Large Desktop**: 1536px+

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

### **Integration Tests**
```typescript
// __tests__/pages/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/LoginPage';

describe('LoginPage', () => {
  it('submits form with correct data', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login success/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📦 **Package Dependencies**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "typescript": "^4.9.0",
    "tailwindcss": "^3.2.0",
    "axios": "^1.3.0",
    "zustand": "^4.3.0",
    "react-hook-form": "^7.43.0",
    "react-query": "^3.39.0",
    "date-fns": "^2.29.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "vite": "^4.1.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.35.0",
    "prettier": "^2.8.0"
  }
}
```

This comprehensive frontend development plan provides a solid foundation for building a modern, scalable React application with excellent user experience and maintainable code structure. 