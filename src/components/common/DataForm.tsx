import React from 'react';
import { Card } from './Card';
import { XIcon, PlusIcon } from 'lucide-react';
interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'number';
  required?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
  prefix?: string;
  width?: 'full' | 'half';
}
interface DataFormProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}
export const DataForm: React.FC<DataFormProps> = ({
  title,
  subtitle,
  fields,
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit'
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {fields.map(field => <div key={field.name} className={field.width === 'full' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' ? <select name={field.name} value={values[field.name]} onChange={e => onChange(field.name, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select {field.label}</option>
                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>)}
                  </select> : field.type === 'textarea' ? <textarea name={field.name} value={values[field.name]} onChange={e => onChange(field.name, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} /> : <div className="relative">
                    {field.prefix && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">{field.prefix}</span>
                      </div>}
                    <input type={field.type} name={field.name} value={values[field.name]} onChange={e => onChange(field.name, e.target.value)} required={field.required} className={`w-full border border-gray-300 rounded-md ${field.prefix ? 'pl-7' : 'px-3'} py-2`} />
                  </div>}
              </div>)}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className={`px-6 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? 'Submitting...' : submitLabel}
            </button>
          </div>
        </form>
      </Card>
    </div>;
};