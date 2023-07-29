import React from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import { get, useFormContext } from 'react-hook-form';

import { cn } from '~/lib/classnames';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
  rules?: RegisterOptions<FieldValues, string>;
}

export function FormTextarea({
  label,
  className,
  style,
  rules,
  ...props
}: FormTextareaProps) {
  const inputId = React.useId();
  const errorMessageId = inputId.concat('-error-message');

  const ctx = useFormContext();
  const field = ctx.register(props.name, rules);
  const { error } = ctx.getFieldState(props.name, ctx.formState);
  const defaultValue = get(ctx.formState.defaultValues, props.name);

  return (
    <div className={cn('grid', className)} style={style}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        aria-describedby={errorMessageId}
        className={cn(
          'border border-gray-200',
          'rounded-lg py-2 px-2',
          error && 'border-red-500'
        )}
        autoFocus={!!error}
        defaultValue={defaultValue}
        {...props}
        {...field}
      />
      {error && (
        <em className="text-red-500" id={errorMessageId}>
          {error.message}
        </em>
      )}
    </div>
  );
}
