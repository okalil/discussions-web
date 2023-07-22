import { sessionStorage } from '~/session.server';

export async function saveToken(request: Request, token: string) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookieHeader);
  session.set('token', token);
  const cookie = await sessionStorage.commitSession(session);
  return cookie;
}

export async function getToken(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookieHeader);
  return session.get('token');
}

export async function destroySession(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookieHeader);
  const cookie = await sessionStorage.destroySession(session);
  return cookie;
}
