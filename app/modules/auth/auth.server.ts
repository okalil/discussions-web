import type { Session } from '@remix-run/node';

export function saveToken(session: Session, token: string) {
  session.set('token', token);
}

export function getToken(session: Session) {
  return session.get('token');
}
