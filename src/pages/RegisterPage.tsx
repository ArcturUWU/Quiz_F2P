import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(name, email, password);
      navigate('/modules');
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
          <h1 className="auth-form-header">Регистрация</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500 rounded-lg flex items-start">
              <AlertCircle className="text-rose-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                Имя
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                placeholder="Иван Иванов"
              />
            </div>
            
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
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Минимум 6 символов"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                Подтверждение пароля
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="Повторите пароль"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              icon={<UserPlus size={18} />}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          
          <div className="auth-divider mt-6">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">или</span>
            <div className="auth-divider-line"></div>
          </div>
          
          <p className="mt-6 text-center text-sm text-[color:var(--text-color)]">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-[color:var(--primary-color)] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;