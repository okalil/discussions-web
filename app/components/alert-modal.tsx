import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '~/lib/classnames';
import { Button } from './button';

interface AlertModalProps extends AlertDialog.AlertDialogProps {
  className?: string;
  trigger: JSX.Element;
  title: string;
  description?: string;
  action: JSX.Element;
}

export const AlertModal = ({
  className,
  trigger,
  title,
  description,
  action,
  ...props
}: AlertModalProps) => (
  <AlertDialog.Root {...props}>
    <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="bg-black bg-opacity-40 data-[state=open]:animate-overlayShow fixed inset-0" />
      <AlertDialog.Content
        className={cn(
          'max-h-[85vh] w-[90vw] max-w-sm',
          'data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'rounded-md bg-white py-5 px-6 shadow focus:outline-none',
          className
        )}
      >
        <AlertDialog.Title
          className={cn('text-lg font-medium', !description && 'mb-5')}
        >
          {title}
        </AlertDialog.Title>
        {description && (
          <AlertDialog.Description className="mb-5 text-gray-500 leading-normal">
            {description}
          </AlertDialog.Description>
        )}

        <div className="flex justify-end gap-3">
          <AlertDialog.Cancel asChild>
            <Button variant="default">Cancelar</Button>
          </AlertDialog.Cancel>

          {action}
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
