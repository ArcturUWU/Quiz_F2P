import React from 'react';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';
import PremiumBanner from '../features/PremiumBanner';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[color:var(--bg-color)] text-[color:var(--text-color)]">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {user && !user.isPremium && (
          <div className="mb-6">
            <PremiumBanner />
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;