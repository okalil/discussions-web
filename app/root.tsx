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

import { getToastSession } from './toasts/toast.server';
import styles from './tailwind.css';
import { NavigationProgress } from './components/navigation-progress';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ request }: DataFunctionArgs) => {
  const toasts = getToastSession(request);
  const messages = await toasts.getMessages();

  return json(
    { messages },
    { headers: { 'Set-Cookie': await toasts.commit() } }
  );
};

export default function App() {
  const { messages } = useLoaderData<typeof loader>();

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

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
