import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);
    
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-brand-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-brand-secondary">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`flex w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-brand-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-tertiary focus:border-transparent ${icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
