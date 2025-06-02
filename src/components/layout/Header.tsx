import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Moon, Sun, Menu, X, LogIn, User, LogOut, CreditCard } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, primaryColor, setPrimaryColor, neonColors } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  // Проверка активного маршрута
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[color:var(--bg-color)]/50 backdrop-blur-lg border-b border-[color:var(--border-color)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-[color:var(--primary-color)] mr-1">Neon</span>
            <span className="text-2xl font-bold text-[color:var(--text-color)]">Quizlet</span>
          </Link>
          
          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-[color:var(--primary-color)] ${
                isActiveRoute('/') ? 'text-[color:var(--primary-color)]' : 'text-[color:var(--text-color)]'
              }`}
            >
              Главная
            </Link>
            <Link 
              to="/modules" 
              className={`text-sm font-medium transition-colors hover:text-[color:var(--primary-color)] ${
                isActiveRoute('/modules') ? 'text-[color:var(--primary-color)]' : 'text-[color:var(--text-color)]'
              }`}
            >
              Мои модули
            </Link>
            <Link 
              to="/stats" 
              className={`text-sm font-medium transition-colors hover:text-[color:var(--primary-color)] ${
                isActiveRoute('/stats') ? 'text-[color:var(--primary-color)]' : 'text-[color:var(--text-color)]'
              }`}
            >
              Статистика
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors hover:text-[color:var(--primary-color)] ${
                isActiveRoute('/pricing') ? 'text-[color:var(--primary-color)]' : 'text-[color:var(--text-color)]'
              }`}
            >
              Тарифы
            </Link>
          </nav>
          
          {/* Действия справа */}
          <div className="flex items-center">
            {/* Цветовая схема для десктопа */}
            <div className="hidden md:flex space-x-2 mr-4">
              {Object.entries(neonColors).map(([name, color]) => (
                <button
                  key={name}
                  className={`w-6 h-6 rounded-full transition-all ${
                    primaryColor === color 
                      ? 'ring-2 ring-[color:var(--text-color)] scale-110' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimaryColor(color)}
                  aria-label={`Выбрать цвет ${name}`}
                />
              ))}
            </div>
            
            {/* Переключатель темы */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[color:var(--card-bg)] text-[color:var(--text-color)]"
              aria-label="Переключить тему"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Авторизация / Профиль пользователя */}
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleUserMenu}
                  className="p-2 rounded-full hover:bg-[color:var(--card-bg)] text-[color:var(--text-color)]"
                  aria-label="Меню пользователя"
                >
                  <User size={20} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[color:var(--card-bg)] border border-[color:var(--border-color)] rounded-lg shadow-xl py-1">
                    <div className="px-4 py-2 border-b border-[color:var(--border-color)]">
                      <p className="text-sm font-medium text-[color:var(--text-color)]">{user.name}</p>
                      <p className="text-xs text-[color:var(--text-color)]/70">{user.email}</p>
                      {user.isPremium && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)] text-xs rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" /> Профиль
                    </Link>
                    {!user.isPremium && (
                      <Link 
                        to="/pricing" 
                        className="flex items-center px-4 py-2 text-sm text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard size={16} className="mr-2" /> Улучшить до Premium
                      </Link>
                    )}
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" /> Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="sm"
                icon={<LogIn size={16} />}
                className="ml-3"
              >
                Войти
              </Button>
            )}
            
            {/* Кнопка меню для мобильных */}
            <button
              onClick={toggleMenu}
              className="p-2 ml-3 rounded-full hover:bg-[color:var(--card-bg)] text-[color:var(--text-color)] md:hidden"
              aria-label="Меню"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden bg-[color:var(--card-bg)] border-b border-[color:var(--border-color)]">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  isActiveRoute('/') 
                    ? 'bg-[color:var(--bg-color)] text-[color:var(--primary-color)]' 
                    : 'text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                to="/modules" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  isActiveRoute('/modules') 
                    ? 'bg-[color:var(--bg-color)] text-[color:var(--primary-color)]' 
                    : 'text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Мои модули
              </Link>
              <Link 
                to="/stats" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  isActiveRoute('/stats') 
                    ? 'bg-[color:var(--bg-color)] text-[color:var(--primary-color)]' 
                    : 'text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Статистика
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  isActiveRoute('/pricing') 
                    ? 'bg-[color:var(--bg-color)] text-[color:var(--primary-color)]' 
                    : 'text-[color:var(--text-color)] hover:bg-[color:var(--bg-color)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Тарифы
              </Link>
            </nav>
            
            {/* Цветовая схема для мобильных */}
            <div className="pt-2 border-t border-[color:var(--border-color)]">
              <p className="text-xs text-[color:var(--text-color)]/70 mb-3">Выберите основной цвет:</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(neonColors).map(([name, color]) => (
                  <button
                    key={name}
                    className={`w-8 h-8 rounded-full transition-all ${
                      primaryColor === color 
                        ? 'ring-2 ring-[color:var(--text-color)] scale-110' 
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setPrimaryColor(color)}
                    aria-label={`Выбрать цвет ${name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;