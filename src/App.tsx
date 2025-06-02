import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Импортируем страницы
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import CreateModulePage from './pages/CreateModulePage';
import EditModulePage from './pages/EditModulePage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import StudyPage from './pages/StudyPage';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';

// Стили
import './index.css';

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/login' }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Компонент для премиум-маршрутов
const PremiumRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/pricing' }) => {
  const { user } = useAuth();
  
  if (!user || !user.isPremium) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      
      <Route path="/modules" element={
        <ProtectedRoute>
          <ModulesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/modules/create" element={
        <ProtectedRoute>
          <CreateModulePage />
        </ProtectedRoute>
      } />
      
      <Route path="/modules/:moduleId" element={
        <ProtectedRoute>
          <ModuleDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/modules/:moduleId/edit" element={
        <ProtectedRoute>
          <EditModulePage />
        </ProtectedRoute>
      } />
      
      <Route path="/modules/:moduleId/study/:mode" element={
        <ProtectedRoute>
          <StudyPage />
        </ProtectedRoute>
      } />
      
      <Route path="/stats" element={
        <ProtectedRoute>
          <StatsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModuleProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ModuleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;