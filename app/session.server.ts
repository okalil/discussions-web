import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['secret_key'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const getSessionStorage = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const commit = async () => {
    const cookie = await sessionStorage.commitSession(session);
    return cookie;
  };

  const destroy = async () => {
    const cookie = await sessionStorage.destroySession(session);
    return cookie;
  };

  return { session, commit, destroy };
};
