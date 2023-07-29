import React from 'react';
import { SpinnerIcon } from '~/icons/spinner-icon';
import { cn } from '~/lib/classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant, className, children, loading, disabled, ...props },
    ref
  ) {
    return (
      <button
        className={cn(
          'flex items-center justify-center',
          'px-4 py-2 rounded-md font-medium text-sm',
          variant === 'primary' && 'bg-gray-900 text-gray-50',
          variant === 'default' && 'border border-gray-200',
          variant === 'danger' && 'text-red-700 bg-red-100 hover:bg-red-200',
          !(loading || disabled) && 'hover:opacity-90',
          (loading || disabled) && 'opacity-80 cursor-not-allowed',
          className
        )}
        disabled={disabled ?? loading}
        {...props}
        ref={ref}
      >
        {loading ? <SpinnerIcon /> : children}
      </button>
    );
  }
);
