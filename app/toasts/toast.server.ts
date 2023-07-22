import { sessionStorage } from '../session.server';

export type ToastMessage = {
  content: string;
  type: 'info' | 'error' | 'success';
};

export function addToast(
  request: Request,
  toastMessage: ToastMessage
): Promise<string> {
  const toasts = getToastSession(request);
  toasts.add(toastMessage);
  return toasts.commit();
}

export function getToastSession(request: Request) {
  const nextMessages: ToastMessage[] = [];

  async function getMessages(): Promise<ToastMessage[]> {
    const cookie = request.headers.get('Cookie');
    const session = await sessionStorage.getSession(cookie);
    const messages = JSON.parse(
      session.get('toasts') || '[]'
    ) as ToastMessage[];
    return messages;
  }

  async function commit(): Promise<string> {
    const cookie = request.headers.get('Cookie');
    const session = await sessionStorage.getSession(cookie);
    session.flash('toasts', JSON.stringify(nextMessages));
    return sessionStorage.commitSession(session);
  }

  function add(toastMessage: ToastMessage): void {
    nextMessages.unshift(toastMessage);
  }

  return { getMessages, commit, add };
}
