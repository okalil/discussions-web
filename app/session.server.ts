import type { Session, SessionData, SessionStorage } from '@remix-run/node';
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

class SessionManager implements Session {
  id: string;
  data: Partial<SessionData & { [x: `__flash_${string}__`]: any }>;
  private session: Session;
  private sessionStorage: SessionStorage;
  constructor(sessionStorage: SessionStorage, session: Session) {
    this.sessionStorage = sessionStorage;
    this.session = session;
    this.id = session.id;
    this.data = session.data;
  }

  unset(key: string): void {
    return this.session.get(key);
  }

  get(key: string) {
    return this.session.get(key);
  }
  set(key: string, value: any) {
    return this.session.set(key, value);
  }
  has(key: string) {
    return this.session.has(key);
  }
  flash(key: string, value: any) {
    return this.session.flash(key, value);
  }
  async commit() {
    return this.sessionStorage.commitSession(this.session);
  }
  async destroy() {
    return this.sessionStorage.destroySession(this.session);
  }
}

export const getSessionManager = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const session = await sessionStorage.getSession(cookie);
  return new SessionManager(sessionStorage, session);
};
