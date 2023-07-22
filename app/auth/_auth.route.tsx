import { Outlet } from '@remix-run/react';
import { cn } from '~/lib/classnames';

export default function AuthRoute() {
  return (
    <div className={cn('h-full flex items-center justify-center', 'py-4 px-4')}>
      <Outlet />
    </div>
  );
}
