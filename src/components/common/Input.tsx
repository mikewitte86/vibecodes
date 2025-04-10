import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  prefix?: string;
}
export const Input: React.FC<InputProps> = ({
  icon,
  prefix,
  ...props
}) => {
  return <div className="relative">
      {prefix && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>}
      {icon && <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>}
      <input {...props} className={`w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${prefix ? 'pl-7' : icon ? 'pl-10' : 'px-3'} py-2
          ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `} />
    </div>;
};