import React from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { cn } from '~/lib/classnames';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  rules?: RegisterOptions<FieldValues, string>;
  mask?: (input: HTMLInputElement) => void;
}

export function FormInput({
  label,
  className,
  style,
  rules,
  mask,
  ...props
}: FormInputProps) {
  const inputId = React.useId();
  const errorMessageId = inputId.concat('-error-message');

  const { register, getFieldState, formState } = useFormContext();
  const field = register(props.name, rules);
  const { error } = getFieldState(props.name, formState);

  return (
    <div className={cn('flex flex-col', className)} style={style}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-describedby={errorMessageId}
        className={cn('border border-gray-200', 'rounded-lg py-2 px-2')}
        autoFocus={!!error}
        {...props}
        {...field}
        ref={element => {
          field.ref(element);
          if (element) mask?.(element);
        }}
      />
      {error && (
        <em className="text-red-500" id={errorMessageId}>
          {error.message}
        </em>
      )}
    </div>
  );
}
