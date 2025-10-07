import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
       const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const AgentMatchingPage = lazy(() => import('./pages/AgentMatchingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminEventPage = lazy(() => import('./pages/AdminEventPage'));
const EventRegistrationsPage = lazy(() => import('./pages/EventRegistrationsPage'));
const RecommendationViewPage = lazy(() => import('./pages/RecommendationViewPage'));
const AllAgentsPage = lazy(() => import('./pages/AllAgentsPage'));
const GiftsPage = lazy(() => import('./pages/GiftsPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const QuizTakerPage = lazy(() => import('./pages/QuizTakerPage'));
const QuizResultsPage = lazy(() => import('./pages/QuizResultsPage'));
const SuperAdminDashboard = lazy(() => import('./components/dashboard/SuperAdminDashboard'));
const FoodForTalkPage = lazy(() => import('./pages/FoodForTalkPage'));
const FoodForTalkRegisterPage = lazy(() => import('./pages/FoodForTalkRegisterPage'));
const FoodForTalkLoginPage = lazy(() => import('./pages/FoodForTalkLoginPage'));
const FoodForTalkSecretLoginPage = lazy(() => import('./pages/FoodForTalkSecretLoginPage'));
const FoodForTalkParticipantsPage = lazy(() => import('./pages/FoodForTalkParticipantsPage'));
const FoodForTalkSecretChatPage = lazy(() => import('./pages/FoodForTalkSecretChatPage'));
const FoodForTalkForgotPasswordPage = lazy(() => import('./pages/FoodForTalkForgotPasswordPage'));
const FoodForTalkResetPasswordPage = lazy(() => import('./pages/FoodForTalkResetPasswordPage'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Wrapper to optionally hide header/footer on certain routes
function AppChrome({ children }) {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/food-for-talk');
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <UserProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <ScrollToTop />
            <AppChrome>
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                    <Route path="/gifts" element={<GiftsPage />} />
                    <Route path="/agent-matching" element={<AgentMatchingPage />} />
                    <Route path="/all-agents" element={<AllAgentsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/help" element={<HelpCenterPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/events" element={<AdminEventPage />} />
                    <Route path="/admin/events/:id" element={<AdminEventPage />} />
                    <Route path="/admin/events/:id/registrations" element={<EventRegistrationsPage />} />
                    <Route path="/recommendation/:shareCode" element={<RecommendationViewPage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/quiz/:id/take" element={<QuizTakerPage />} />
                    <Route path="/quiz/:id/results" element={<QuizResultsPage />} />
                    
                    {/* Super Admin Routes */}
                    <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
                    
                    {/* Food for Talk Event Routes */}
            <Route path="/food-for-talk" element={<FoodForTalkPage />} />
            <Route path="/food-for-talk/register" element={<FoodForTalkRegisterPage />} />
            <Route path="/food-for-talk/login" element={<FoodForTalkLoginPage />} />
            <Route path="/food-for-talk/secret-login" element={<FoodForTalkSecretLoginPage />} />
            <Route path="/food-for-talk/participants" element={<FoodForTalkParticipantsPage />} />
            <Route path="/food-for-talk/secret-chat" element={<FoodForTalkSecretChatPage />} />
            <Route path="/food-for-talk/forgot-password" element={<FoodForTalkForgotPasswordPage />} />
            <Route path="/food-for-talk/reset-password" element={<FoodForTalkResetPasswordPage />} />
                  </Routes>
                </Suspense>
              </main>
            </AppChrome>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={3}
              />
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App; 