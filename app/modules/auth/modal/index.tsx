import React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { Modal } from '~/components/modal';
import { LoginView } from './login';
import { RegisterView } from './register';

interface AuthModalProps {
  trigger: JSX.Element;
  defaultView?: 'login' | 'register';
}

export function AuthModal({ trigger, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = React.useState(defaultView);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Slot onClick={() => setOpen(true)}>{trigger}</Slot>
      <Modal open={open} onOpenChange={setOpen}>
        {view === 'login' && (
          <LoginView onRegisterClick={() => setView('register')} />
        )}
        {view === 'register' && (
          <RegisterView onLoginClick={() => setView('login')} />
        )}
      </Modal>
    </>
  );
}
