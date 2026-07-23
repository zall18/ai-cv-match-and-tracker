import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const textareaId = id || Math.random().toString(36).substring(7);
    
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-semibold text-brand-secondary">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`flex w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-brand-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-tertiary focus:border-transparent min-h-[100px] resize-y ${className}`}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
