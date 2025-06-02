import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Обработка нажатия Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Предотвращение скролла при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Клик вне модального окна
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] overflow-auto bg-gray-900 border border-gray-800 rounded-xl shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-gray-800 bg-gray-900">
          <h2 className="text-xl font-medium text-white">{title}</h2>
          <Button 
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="p-1.5 rounded-lg"
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-5">
          {children}
        </div>
        
        {footer && (
          <div className="sticky bottom-0 p-5 border-t border-gray-800 bg-gray-900">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
