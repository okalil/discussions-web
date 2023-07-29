import { cn } from '~/lib/classnames';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size: number;
  className?: string;
}

export function Avatar({ src, alt, size, className }: AvatarProps) {
  if (!src)
    return (
      <div
        className={cn(
          'grid place-items-center rounded-full',
          'border border-gray-300'
        )}
        style={{ width: size, height: size }}
      >
        {alt.slice(0, 1)}
      </div>
    );

  return (
    <img
      src={new URL(src, process.env.API_URL).toString()}
      alt={alt}
      className={cn('rounded-full', className)}
      width={size}
      height={size}
    />
  );
}
