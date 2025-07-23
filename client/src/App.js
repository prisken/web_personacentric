import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContestsPage from './pages/ContestsPage';
import AITrialPage from './pages/AITrialPage';
import AgentMatchingPage from './pages/AgentMatchingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import HelpCenterPage from './pages/HelpCenterPage';
import DashboardPage from './pages/DashboardPage';
import AdminEventPage from './pages/AdminEventPage';
import RecommendationViewPage from './pages/RecommendationViewPage';
import AllAgentsPage from './pages/AllAgentsPage';

function App() {
  return (
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
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                <Route path="/contests" element={<ContestsPage />} />
                <Route path="/ai-trial" element={<AITrialPage />} />
                <Route path="/agent-matching" element={<AgentMatchingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin/events" element={<AdminEventPage />} />
                <Route path="/admin/events/:id" element={<AdminEventPage />} />
                <Route path="/recommendation/:shareCode" element={<RecommendationViewPage />} />
                <Route path="/all-agents" element={<AllAgentsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App; 