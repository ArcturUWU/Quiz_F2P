import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { upgradeToPremium } = useAuth();
  const navigate = useNavigate();
  
  // Форматирование номера карты (добавление пробелов)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Форматирование даты истечения срока (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  
  // Обработка изменения номера карты
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };
  
  // Обработка изменения даты истечения срока
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpiryDate(formatExpiryDate(value));
  };
  
  // Проверка валидности формы
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardName.trim().length > 0 &&
      expiryDate.length === 5 &&
      cvc.length === 3
    );
  };
  
  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setLoading(true);
    
    // Имитация процесса оплаты
    setTimeout(() => {
      upgradeToPremium();
      setSuccess(true);
      
      // Редирект на страницу профиля через 2 секунды
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[color:var(--text-color)] mb-8">Оформление подписки</h1>
        
        {success ? (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[color:var(--primary-color)]/10 flex items-center justify-center">
              <CheckCircle className="text-[color:var(--primary-color)]" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[color:var(--text-color)] mb-2">Оплата прошла успешно!</h2>
            <p className="text-[color:var(--text-color)]/70 mb-6">
              Ваша Premium-подписка активирована. Вы будете перенаправлены на страницу профиля через несколько секунд.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <h2 className="text-xl font-medium text-[color:var(--text-color)] mb-6 flex items-center">
                  <CreditCard size={24} className="mr-2 text-[color:var(--primary-color)]" />
                  Информация об оплате
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                      Номер карты
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="auth-input"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                      Имя владельца карты
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="IVAN IVANOV"
                      className="auth-input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                        Срок действия
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="auth-input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-[color:var(--text-color)] mb-1">
                        CVC/CVV
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="auth-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-[color:var(--text-color)]/70 mb-6">
                    <Lock size={16} className="mr-2" />
                    Платежная информация защищена шифрованием
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? 'Обработка платежа...' : 'Оплатить 299 ₽'}
                  </Button>
                </form>
              </Card>
            </div>
            
            <div>
              <Card>
                <h2 className="text-lg font-medium text-[color:var(--text-color)] mb-4">
                  Сводка заказа
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
                    <span className="text-[color:var(--text-color)]/70">План</span>
                    <span className="font-medium text-[color:var(--text-color)]">Premium</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
                    <span className="text-[color:var(--text-color)]/70">Период</span>
                    <span className="font-medium text-[color:var(--text-color)]">1 месяц</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-3 text-lg font-medium">
                  <span className="text-[color:var(--text-color)]">Итого</span>
                  <span className="text-[color:var(--primary-color)]">299 ₽</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[color:var(--border-color)]">
                  <p className="text-xs text-[color:var(--text-color)]/70">
                    Нажимая кнопку "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;