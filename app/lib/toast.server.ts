import type { Session } from '@remix-run/node';

export type ToastMessage = {
  content: string;
  type: 'info' | 'error' | 'success';
};

export function addToast(session: Session, toastMessage: ToastMessage) {
  const toasts = getToastStorage(session);
  toasts.add(toastMessage);
}

export function getToastStorage(session: Session) {
  const nextMessages: ToastMessage[] = [];

  function getMessages() {
    const messages = JSON.parse(
      session.get('toasts') || '[]'
    ) as ToastMessage[];
    return messages;
  }

  function add(toastMessage: ToastMessage): void {
    nextMessages.unshift(toastMessage);
    session.flash('toasts', JSON.stringify(nextMessages));
  }

  return { getMessages, add };
}
