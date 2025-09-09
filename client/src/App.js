import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

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
            <div className="min-h-screen flex flex-col bg-white">
              <Header />
              <main className="flex-grow pt-16 lg:pt-20">
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
                  </Routes>
                </Suspense>
              </main>
              <Footer />
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
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App; 