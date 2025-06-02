import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Mail, CreditCard, Calendar, AlertCircle, CheckCircle, Sparkles, Settings, Trophy, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    // Инициализация канваса с фрактальной анимацией
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Установка размеров канваса
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Параметры анимации
    const particles: { x: number; y: number; size: number; color: string; speed: number }[] = [];
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const primaryColorRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb').trim();
    
    // Создание частиц
    const createParticles = () => {
      const particleCount = Math.floor(canvas.width / 20); // Количество частиц зависит от ширины
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          color: i % 3 === 0 ? primaryColor : `rgba(${primaryColorRgb}, ${Math.random() * 0.5 + 0.2})`,
          speed: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    createParticles();
    
    // Анимация частиц
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Рисуем частицы
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Обновляем позицию частиц (движение вверх)
        particle.y -= particle.speed;
        
        // Если частица выходит за пределы экрана, возвращаем её вниз
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // Соединяем близкие частицы линиями
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${primaryColorRgb}, ${0.1 - distance / 800})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  if (!user) {
    return null;
  }
  
  const handleUpdateProfile = () => {
    setError('');
    setMessage('');
    
    if (!name.trim()) {
      setError('Имя не может быть пустым');
      return;
    }
    
    updateUser({ name });
    setMessage('Профиль успешно обновлен');
  };
  
  // Форматирование даты для отображения даты окончания подписки
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Данные для радиальной статистики (просто для демонстрации)
  const statsData = [
    { label: 'Изучено терминов', value: 85, color: '#00BFFF' },
    { label: 'Завершено тестов', value: 72, color: '#FF1493' },
    { label: 'Верных ответов', value: 64, color: '#00FF7F' }
  ];
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Фоновая анимация */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10 opacity-30" />
        
        {/* Шапка профиля */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[color:var(--bg-color)] to-[color:var(--card-bg)] shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.3)] border border-[color:var(--border-color)]">
          <div className="absolute top-0 left-0 right-0 h-32 bg-[color:var(--primary-color)]/10 backdrop-blur-sm"></div>
          
          <div className="relative px-8 pt-12 pb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Аватар пользователя */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[color:var(--bg-color)] to-[color:var(--primary-color)]/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.5)] border-2 border-[color:var(--primary-color)]/30">
                <span className="text-5xl font-bold text-[color:var(--primary-color)]">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Информация о пользователе */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-[color:var(--text-color)] mb-2">{name}</h1>
                <p className="text-[color:var(--text-color)]/70 flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span>{email}</span>
                </p>
                
                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  {user.isPremium ? (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)] text-sm border border-[color:var(--primary-color)]/30 shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.3)]">
                      <Sparkles size={14} className="mr-1" />
                      Premium
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-gray-400 text-sm border border-gray-700">
                      <CreditCard size={14} className="mr-1" />
                      Бесплатный аккаунт
                    </div>
                  )}
                  
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-gray-400 text-sm border border-gray-700">
                    <Calendar size={14} className="mr-1" />
                    С {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
              
              {/* Кнопки управления профилем на десктопе */}
              <div className="hidden md:block">
                {!user.isPremium && (
                  <Button
                    as={Link}
                    to="/pricing"
                    icon={<Sparkles size={18} />}
                    className="shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)]"
                  >
                    Перейти на Premium
                  </Button>
                )}
              </div>
            </div>
            
            {/* Кнопки управления профилем на мобильных */}
            <div className="mt-6 flex justify-center md:hidden">
              {!user.isPremium && (
                <Button
                  as={Link}
                  to="/pricing"
                  icon={<Sparkles size={18} />}
                  className="shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)]"
                >
                  Перейти на Premium
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Вкладки */}
        <div className="flex border-b border-[color:var(--border-color)] mb-6 overflow-x-auto scrollbar-hide">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'text-[color:var(--primary-color)] border-b-2 border-[color:var(--primary-color)]'
                : 'text-[color:var(--text-color)]/70 hover:text-[color:var(--text-color)]'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'stats'
                ? 'text-[color:var(--primary-color)] border-b-2 border-[color:var(--primary-color)]'
                : 'text-[color:var(--text-color)]/70 hover:text-[color:var(--text-color)]'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Статистика
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'subscription'
                ? 'text-[color:var(--primary-color)] border-b-2 border-[color:var(--primary-color)]'
                : 'text-[color:var(--text-color)]/70 hover:text-[color:var(--text-color)]'
            }`}
            onClick={() => setActiveTab('subscription')}
          >
            Подписка
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'settings'
                ? 'text-[color:var(--primary-color)] border-b-2 border-[color:var(--primary-color)]'
                : 'text-[color:var(--text-color)]/70 hover:text-[color:var(--text-color)]'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </button>
        </div>
        
        {/* Контент вкладок */}
        <div className="grid gap-6">
          {/* Вкладка "Профиль" */}
          {activeTab === 'profile' && (
            <Card className="backdrop-blur-sm bg-[color:var(--card-bg)]/80 border-[color:var(--border-color)] shadow-lg">
              <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                <User size={20} className="mr-2 text-[color:var(--primary-color)]" />
                Личная информация
              </h2>
              
              {message && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500 rounded-lg flex items-start backdrop-blur-sm">
                  <CheckCircle className="text-emerald-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-emerald-500">{message}</p>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500 rounded-lg flex items-start backdrop-blur-sm">
                  <AlertCircle className="text-rose-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-rose-500">{error}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                  Имя
                </label>
                <div className="relative rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--primary-color)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute left-0 inset-y-0 w-10 flex items-center justify-center text-[color:var(--text-color)]/60 bg-[color:var(--bg-color)]/50 backdrop-blur-sm">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[color:var(--bg-color)]/30 border border-[color:var(--border-color)] py-2.5 pl-12 pr-4 text-[color:var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/50 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                  Email
                </label>
                <div className="relative rounded-lg overflow-hidden">
                  <div className="absolute left-0 inset-y-0 w-10 flex items-center justify-center text-[color:var(--text-color)]/60 bg-[color:var(--bg-color)]/50 backdrop-blur-sm">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[color:var(--bg-color)]/30 border border-[color:var(--border-color)] py-2.5 pl-12 pr-4 text-[color:var(--text-color)]/70 rounded-lg cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-[color:var(--text-color)]/60">
                  Email нельзя изменить после регистрации.
                </p>
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Сохранить изменения</span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--primary-color)]/70 transition-transform duration-300 ease-in-out"></div>
              </Button>
            </Card>
          )}
          
          {/* Вкладка "Статистика" */}
          {activeTab === 'stats' && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="backdrop-blur-sm bg-[color:var(--card-bg)]/80 border-[color:var(--border-color)] shadow-lg">
                <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                  <Trophy size={20} className="mr-2 text-[color:var(--primary-color)]" />
                  Активность обучения
                </h2>
                
                <div className="space-y-6">
                  {statsData.map((stat, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-[color:var(--text-color)]">{stat.label}</span>
                        <span className="text-sm font-medium text-[color:var(--text-color)]">{stat.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-[color:var(--bg-color)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${stat.value}%`, 
                            backgroundColor: stat.color,
                            boxShadow: `0 0 10px ${stat.color}`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Link 
                    to="/stats" 
                    className="text-sm text-[color:var(--primary-color)] hover:underline"
                  >
                    Просмотреть подробную статистику
                  </Link>
                </div>
              </Card>
              
              <Card className="backdrop-blur-sm bg-[color:var(--card-bg)]/80 border-[color:var(--border-color)] shadow-lg">
                <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                  <Sparkles size={20} className="mr-2 text-[color:var(--primary-color)]" />
                  Достижения
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {['Начинающий', 'Стремительный старт', 'Настойчивость', 'Совершенство'].map((achievement, index) => (
                    <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-[color:var(--bg-color)]/50 border border-[color:var(--border-color)] transition-transform hover:scale-105 duration-300">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[color:var(--primary-color)]/20 mb-2 shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.3)]">
                        {index % 4 === 0 && <User size={24} className="text-[color:var(--primary-color)]" />}
                        {index % 4 === 1 && <Trophy size={24} className="text-[color:var(--primary-color)]" />}
                        {index % 4 === 2 && <Calendar size={24} className="text-[color:var(--primary-color)]" />}
                        {index % 4 === 3 && <Sparkles size={24} className="text-[color:var(--primary-color)]" />}
                      </div>
                      <span className="text-xs text-center text-[color:var(--text-color)]">{achievement}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-[color:var(--border-color)]">
                  <p className="text-xs text-center text-[color:var(--text-color)]/50">
                    Продолжайте обучение, чтобы разблокировать больше достижений
                  </p>
                </div>
              </Card>
            </div>
          )}
          
          {/* Вкладка "Подписка" */}
          {activeTab === 'subscription' && (
            <Card className="backdrop-blur-sm bg-[color:var(--card-bg)]/80 border-[color:var(--border-color)] shadow-lg relative overflow-hidden">
              <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                <CreditCard size={20} className="mr-2 text-[color:var(--primary-color)]" />
                Информация о подписке
              </h2>
              
              <div className="relative z-10">
                <div className={`p-6 rounded-xl border-2 mb-6 backdrop-blur-sm ${
                  user.isPremium 
                    ? 'bg-[color:var(--primary-color)]/10 border-[color:var(--primary-color)]/30 shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.3)]' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        user.isPremium ? 'bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)]' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {user.isPremium ? <Sparkles size={24} /> : <CreditCard size={24} />}
                      </div>
                      <div className="ml-4">
                        <h3 className={`text-lg font-medium ${
                          user.isPremium ? 'text-[color:var(--primary-color)]' : 'text-[color:var(--text-color)]'
                        }`}>
                          {user.isPremium ? 'Premium' : 'Бесплатный аккаунт'}
                        </h3>
                        {user.isPremium && user.premiumExpiry && (
                          <div className="flex items-center text-sm text-[color:var(--text-color)]/70 mt-1">
                            <Calendar size={14} className="mr-1" />
                            До {formatDate(user.premiumExpiry)}
                          </div>
                        )}
                      </div>
                    </div>
                    {user.isPremium && (
                      <div className="px-3 py-1 rounded-full bg-[color:var(--primary-color)]/20 border border-[color:var(--primary-color)]/30 text-xs text-[color:var(--primary-color)]">
                        Активна
                      </div>
                    )}
                  </div>
                  
                  {user.isPremium ? (
                    <div className="grid gap-3 grid-cols-2 mt-6">
                      <div className="flex items-center">
                        <Shield size={16} className="text-emerald-400 mr-2" />
                        <span className="text-sm text-[color:var(--text-color)]">Неограниченные модули</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={16} className="text-emerald-400 mr-2" />
                        <span className="text-sm text-[color:var(--text-color)]">Расширенная статистика</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={16} className="text-emerald-400 mr-2" />
                        <span className="text-sm text-[color:var(--text-color)]">Синхронизация устройств</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={16} className="text-emerald-400 mr-2" />
                        <span className="text-sm text-[color:var(--text-color)]">Приоритетная поддержка</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-[color:var(--text-color)]/70 mb-4">
                        Улучшите свой опыт обучения с Premium-подпиской. Получите доступ к неограниченному количеству модулей и расширенной статистике.
                      </p>
                      <Button
                        as={Link}
                        to="/pricing"
                        className="w-full group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <Sparkles size={18} className="mr-2" />
                          Перейти на Premium
                        </span>
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-[color:var(--primary-color)] to-[color:var(--primary-color)]/70 transition-transform duration-300 ease-in-out"></div>
                      </Button>
                    </div>
                  )}
                </div>
                
                {user.isPremium && (
                  <div className="p-4 bg-[color:var(--bg-color)]/50 rounded-lg border border-[color:var(--border-color)]">
                    <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3">Детали подписки</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-[color:var(--border-color)]">
                        <span className="text-sm text-[color:var(--text-color)]/70">План</span>
                        <span className="text-sm font-medium text-[color:var(--text-color)]">Premium</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[color:var(--border-color)]">
                        <span className="text-sm text-[color:var(--text-color)]/70">Стоимость</span>
                        <span className="text-sm font-medium text-[color:var(--text-color)]">299 ₽/месяц</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[color:var(--border-color)]">
                        <span className="text-sm text-[color:var(--text-color)]/70">Статус</span>
                        <span className="text-sm font-medium text-emerald-400">Активна</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-[color:var(--text-color)]/70">Дата окончания</span>
                        <span className="text-sm font-medium text-[color:var(--text-color)]">
                          {user.premiumExpiry ? formatDate(user.premiumExpiry) : 'Бессрочно'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Декоративные элементы */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--primary-color)]/5 rounded-full filter blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[color:var(--primary-color)]/5 rounded-full filter blur-3xl -z-10"></div>
            </Card>
          )}
          
          {/* Вкладка "Настройки" */}
          {activeTab === 'settings' && (
            <Card className="backdrop-blur-sm bg-[color:var(--card-bg)]/80 border-[color:var(--border-color)] shadow-lg">
              <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                <Settings size={20} className="mr-2 text-[color:var(--primary-color)]" />
                Настройки аккаунта
              </h2>
              
              <div className="space-y-6">
                {/* Секция безопасности */}
                <div className="p-4 border border-[color:var(--border-color)] rounded-lg">
                  <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3">Безопасность</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                        Текущий пароль
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[color:var(--bg-color)]/30 border border-[color:var(--border-color)] py-2.5 px-4 text-[color:var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                        Новый пароль
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[color:var(--bg-color)]/30 border border-[color:var(--border-color)] py-2.5 px-4 text-[color:var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                        Подтверждение пароля
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[color:var(--bg-color)]/30 border border-[color:var(--border-color)] py-2.5 px-4 text-[color:var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]/50 transition-all"
                      />
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      Изменить пароль
                    </Button>
                  </div>
                </div>
                
                {/* Секция уведомлений */}
                <div className="p-4 border border-[color:var(--border-color)] rounded-lg">
                  <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3">Уведомления</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-color)]">Email-напоминания</p>
                        <p className="text-xs text-[color:var(--text-color)]/70">Получать напоминания о занятиях</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--primary-color)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-color)]">Новости и обновления</p>
                        <p className="text-xs text-[color:var(--text-color)]/70">Получать информацию о новых функциях</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[color:var(--primary-color)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Секция удаления аккаунта */}
                <div className="p-4 border border-rose-900/30 rounded-lg bg-rose-950/10">
                  <h3 className="text-lg font-medium text-rose-400 mb-3">Удаление аккаунта</h3>
                  <p className="text-sm text-[color:var(--text-color)]/70 mb-4">
                    Все ваши данные, включая модули, статистику и прогресс обучения, будут безвозвратно удалены.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-rose-600 text-rose-400 hover:bg-rose-950/30"
                  >
                    Удалить аккаунт
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;