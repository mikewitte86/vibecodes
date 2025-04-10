import React, { useState, Children, cloneElement, isValidElement } from 'react';
import { Input } from './Input';
import { FormField } from './FormField';
interface FormProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  defaultValues?: Record<string, any>;
}
export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  defaultValues = {}
}) => {
  const [formData, setFormData] = useState(defaultValues);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const setValue = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const formContext = {
    formData,
    setValue
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      {Children.map(children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          formContext
        });
      }
      return child;
    })}
    </form>;
};
export const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({
  title,
  children
}) => {
  return <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>;
};