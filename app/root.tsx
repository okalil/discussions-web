import React from 'react';
import {
  json,
  type DataFunctionArgs,
  type LinksFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { toast, Toaster } from 'react-hot-toast';

import { NavigationProgress } from './components/navigation-progress';
import { getToken } from './auth/auth.server';
import { getToastSession } from './toasts/toast.server';
import { useSocketAuth } from './ws/use-socket-auth';
import styles from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

declare global {
  export interface Window {
    token?: string;
  }
}

export const loader = async ({ request }: DataFunctionArgs) => {
  const token = await getToken(request);
  const toasts = getToastSession(request);
  const messages = await toasts.getMessages();

  return json(
    { messages, token, env: { API_URL: process.env.API_URL } },
    { headers: { 'Set-Cookie': await toasts.commit() } }
  );
};

export default function App() {
  const { messages, token, env } = useLoaderData<typeof loader>();

  React.useEffect(() => {
    messages.forEach(message => {
      switch (message.type) {
        case 'success':
          return toast.success(message.content);
        case 'error':
          return toast.error(message.content, { duration: 5000 });
        default:
          toast(message.content);
      }
    });
  }, [messages]);

  useSocketAuth(token);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <NavigationProgress />
        <Toaster position="top-right" />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = { env: ${JSON.stringify(env)} }`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.token = ${token}`,
          }}
        />
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
