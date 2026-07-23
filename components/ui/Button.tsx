import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const variants = {
      primary: "bg-brand-primary text-white hover:bg-slate-800 focus:ring-brand-primary",
      secondary: "bg-slate-100 text-brand-secondary hover:bg-slate-200 focus:ring-slate-200",
      inverted: "bg-brand-secondary text-white hover:bg-slate-600 focus:ring-brand-secondary",
      outlined: "bg-transparent border border-slate-300 text-brand-secondary hover:bg-slate-50 focus:ring-slate-300"
    };

    return (
      <button 
        ref={ref}
        className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} 
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
