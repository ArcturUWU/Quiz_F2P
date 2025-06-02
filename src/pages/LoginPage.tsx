import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { LogIn, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <div className="auth-form-container">
          <h1 className="auth-form-header">Вход в систему</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500 rounded-lg flex items-start">
              <AlertCircle className="text-rose-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              icon={<LogIn size={18} />}
            >
              {loading ? 'Входим...' : 'Войти'}
            </Button>
          </form>
          
          <div className="auth-divider mt-6">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">или</span>
            <div className="auth-divider-line"></div>
          </div>
          
          <p className="mt-6 text-center text-sm text-[color:var(--text-color)]">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-[color:var(--primary-color)] hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;