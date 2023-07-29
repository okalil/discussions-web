import type { DataFunctionArgs } from '@remix-run/node';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { getToken } from '~/modules/auth/auth.server';
import { getUser } from './get-user.server';
import { Button } from '~/components/button';
import { cn } from '~/lib/classnames';
import { getSessionStorage } from '~/session.server';

export const loader = async ({ request }: DataFunctionArgs) => {
  const storage = await getSessionStorage(request);
  const token = await getToken(storage.session);
  if (token) return getUser(token);
  return null;
};

export default function LayoutRoute() {
  const optionalUser = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="bg-gray-900 text-gray-50">
        <div
          className={cn(
            'flex items-center max-w-4xl mx-auto',
            'px-3 py-2 h-14'
          )}
        >
          <h1 className="font-semibold text-xl">
            <Link to="/">Community</Link>
          </h1>

          {!optionalUser && (
            <div className="flex gap-3 ml-auto">
              <Form action="login">
                <Button>Login</Button>
              </Form>
              <Form action="register">
                <Button variant="default">Criar conta</Button>
              </Form>
            </div>
          )}

          {optionalUser && (
            <Form method="post" action="logout" className="ml-auto">
              <Button variant="danger">Sair</Button>
            </Form>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
