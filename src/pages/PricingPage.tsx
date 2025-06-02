import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Check, Sparkles, X } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Планы подписки
  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: 0,
      period: '',
      features: [
        'До 5 учебных модулей',
        'Базовые режимы обучения',
        'Стандартная статистика',
        'Доступ с одного устройства'
      ],
      missingFeatures: [
        'Неограниченное количество модулей',
        'Расширенная статистика обучения',
        'Экспорт и импорт модулей',
        'Синхронизация между устройствами',
        'Приоритетная поддержка'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 299,
      period: 'месяц',
      popular: true,
      features: [
        'Неограниченное количество модулей',
        'Все режимы обучения',
        'Расширенная статистика',
        'Экспорт и импорт модулей',
        'Синхронизация между устройствами',
        'Приоритетная поддержка',
        'Без рекламы'
      ]
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // Ничего не делаем для бесплатного плана
      return;
    }
    
    // Для премиум-плана переходим на страницу оплаты
    navigate('/checkout');
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[color:var(--text-color)] mb-4">
          Выберите подходящий план
        </h1>
        <p className="text-xl text-[color:var(--text-color)]/70 mb-12 max-w-2xl mx-auto">
          Получите доступ к расширенным возможностям и сделайте ваше обучение более эффективным с Premium-подпиской
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              <div className="pricing-card-header">
                {plan.popular && (
                  <div className="inline-block px-3 py-1 bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)] text-xs rounded-full mb-3">
                    Популярный выбор
                  </div>
                )}
                <h2 className="text-2xl font-bold text-[color:var(--text-color)]">{plan.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-[color:var(--text-color)]">
                    {plan.price === 0 ? 'Бесплатно' : `${plan.price} ₽`}
                  </span>
                  {plan.period && (
                    <span className="text-[color:var(--text-color)]/70">/{plan.period}</span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3 text-left">
                    Включено:
                  </h3>
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="pricing-feature">
                        <Check size={18} className="pricing-feature-check" />
                        <span className="text-[color:var(--text-color)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.missingFeatures && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-3 text-left">
                      Недоступно:
                    </h3>
                    <ul className="space-y-2 text-left">
                      {plan.missingFeatures.map((feature, index) => (
                        <li key={index} className="pricing-feature">
                          <X size={18} className="pricing-feature-missing" />
                          <span className="text-[color:var(--text-color)]/50">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Показываем кнопку в зависимости от состояния пользователя */}
                {!user ? (
                  <Button
                    as={Link}
                    to="/register"
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                    icon={plan.popular ? <Sparkles size={18} /> : undefined}
                  >
                    {plan.id === 'free' ? 'Зарегистрироваться' : 'Выбрать план'}
                  </Button>
                ) : user.isPremium && plan.id === 'premium' ? (
                  <Button
                    disabled
                    className="w-full cursor-not-allowed"
                  >
                    Текущий план
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                    icon={plan.popular ? <Sparkles size={18} /> : undefined}
                    disabled={(plan.id === 'free' && !user.isPremium) || (plan.id === 'premium' && user.isPremium)}
                  >
                    {plan.id === 'free' ? 'Текущий план' : 'Выбрать план'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-[color:var(--card-bg)] border border-[color:var(--border-color)] rounded-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-4">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">
                Могу ли я отменить подписку в любое время?
              </h3>
              <p className="text-[color:var(--text-color)]/70">
                Да, вы можете отменить подписку в любое время. После отмены вы сможете пользоваться Premium-возможностями до конца оплаченного периода.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">
                Что происходит с моими модулями при отмене Premium?
              </h3>
              <p className="text-[color:var(--text-color)]/70">
                Вы сохраняете доступ ко всем созданным модулям, но если их количество превышает лимит бесплатного плана, вы не сможете создавать новые модули.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">
                Есть ли пробный период?
              </h3>
              <p className="text-[color:var(--text-color)]/70">
                В настоящее время мы не предоставляем пробный период для Premium-подписки, но вы можете использовать бесплатный план, чтобы оценить основные возможности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;