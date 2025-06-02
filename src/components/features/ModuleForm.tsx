import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { Term } from '../../types';
import { generateId } from '../../utils/storage';

interface ModuleFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialTerms?: Term[];
  onSubmit: (title: string, description: string, terms: Term[]) => void;
  submitLabel?: string;
}

const ModuleForm: React.FC<ModuleFormProps> = ({
  initialTitle = '',
  initialDescription = '',
  initialTerms = [],
  onSubmit,
  submitLabel = 'Создать'
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [errors, setErrors] = useState<{ title?: string; terms?: string }>({});
  
  // Добавление нового пустого термина
  const addEmptyTerm = () => {
    setTerms([...terms, { id: generateId(), term: '', definition: '', learned: false }]);
  };
  
  // Обновление термина
  const updateTerm = (index: number, field: 'term' | 'definition', value: string) => {
    const newTerms = [...terms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    setTerms(newTerms);
  };
  
  // Удаление термина
  const removeTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };
  
  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: { title?: string; terms?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Название обязательно';
    }
    
    const hasEmptyTerms = terms.some(t => !t.term.trim() || !t.definition.trim());
    const hasNoTerms = terms.length === 0;
    
    if (hasEmptyTerms) {
      newErrors.terms = 'Все поля терминов должны быть заполнены';
    } else if (hasNoTerms) {
      newErrors.terms = 'Добавьте хотя бы один термин';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(title, description, terms);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Название модуля"
          placeholder="Например: Французские глаголы"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          error={errors.title}
        />
      </div>
      
      <div>
        <Textarea
          label="Описание (опционально)"
          placeholder="Добавьте описание для этого учебного модуля"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          rows={3}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">Термины</h3>
          <Button 
            type="button"
            onClick={addEmptyTerm}
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
          >
            Добавить термин
          </Button>
        </div>
        
        {errors.terms && (
          <p className="text-red-500 text-xs mb-3">{errors.terms}</p>
        )}
        
        <div className="space-y-4">
          {terms.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
              <p className="text-gray-500">Нажмите "Добавить термин" для начала</p>
            </div>
          ) : (
            terms.map((term, index) => (
              <div key={term.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Термин"
                    value={term.term}
                    onChange={(e) => updateTerm(index, 'term', e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Определение"
                    value={term.definition}
                    onChange={(e) => updateTerm(index, 'definition', e.target.value)}
                    fullWidth
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeTerm(index)}
                  variant="secondary"
                  size="sm"
                  className="mt-2 p-2"
                  aria-label="Удалить термин"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ModuleForm;
