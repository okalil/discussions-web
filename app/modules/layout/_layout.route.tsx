import type { DataFunctionArgs } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';

import { getToken } from '~/modules/auth/auth.server';
import { Button } from '~/components/button';
import { cn } from '~/lib/classnames';
import { getSessionStorage } from '~/session.server';
import { AuthModal } from '../auth/modal';
import { getUser } from './get-user.server';

export const loader = async ({ request }: DataFunctionArgs) => {
  const storage = await getSessionStorage(request);
  const token = await getToken(storage.session);
  if (token) return getUser(token);
  return null;
};

export type LayoutLoader = typeof loader;

export default function LayoutRoute() {
  const optionalUser = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="bg-gray-900 text-gray-50">
        <div
          className={cn(
            'flex items-center max-w-5xl mx-auto',
            'px-3 py-2 h-14'
          )}
        >
          <h1 className="font-semibold text-xl">
            <Link to="/">Community</Link>
          </h1>

          {!optionalUser && (
            <div className="flex gap-3 ml-auto">
              {/* progressive enhancement: defaults to form route in case js is not present to open modal */}

              <Form action="login" onSubmit={e => e.preventDefault()}>
                <AuthModal trigger={<Button>Login</Button>} />
              </Form>

              <Form action="register" onSubmit={e => e.preventDefault()}>
                <AuthModal
                  trigger={<Button variant="default">Criar conta</Button>}
                  defaultView="register"
                />
              </Form>
            </div>
          )}

          {optionalUser && (
            <Form method="post" action="logout" replace className="ml-auto">
              <Button variant="danger">Sair</Button>
            </Form>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
