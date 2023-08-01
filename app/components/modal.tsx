import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { cn } from '~/lib/classnames';

interface ModalProps extends Dialog.DialogProps {
  className?: string;
}

function Modal({ children, className, ...props }: ModalProps) {
  const [hasHydrated, setHasHydrated] = React.useState(false);
  React.useEffect(() => setHasHydrated(true), []);

  return (
    <Dialog.Root {...props}>
      {hasHydrated && (
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black bg-opacity-40 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content
            className={cn(
              'max-h-[85vh] w-[90vw] max-w-sm',
              'data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'rounded-md bg-white py-5 px-6 shadow focus:outline-none',
              className
            )}
          >
            {children}

            <Dialog.Close asChild>
              <button
                className={cn(
                  'hover:bg-gray-100 absolute top-4 right-4 h-6 w-6 appearance-none',
                  'flex items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
                )}
                aria-label="Close"
              >
                {/* <Cross2Icon /> */}X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

export { Modal };
