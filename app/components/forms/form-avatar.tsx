import React from 'react';
import {
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { Avatar } from '../avatar';

interface FormAvatarProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'alt' | 'size' | 'src'
  > {
  name: string;
  rules?: RegisterOptions<FieldValues, string>;

  src?: string | null;
  alt: string;
  size: number;
}

export function FormAvatar({
  src: defaultSrc,
  alt,
  size,
  name,
  rules,
  className,
  ...props
}: FormAvatarProps) {
  const ctx = useFormContext();

  const getFile = () => {
    if (typeof document === 'undefined') return null;
    const fileList = ctx.watch(name);
    return fileList instanceof FileList ? fileList.item(0) : null;
  };
  const file = getFile();
  const src = file ? URL.createObjectURL(file) : defaultSrc;

  return (
    <label className={className}>
      <Avatar src={src} alt={alt} size={size} />

      <input
        type="file"
        {...ctx.register(name, rules)}
        {...props}
        className="hidden"
      />
    </label>
  );
}
