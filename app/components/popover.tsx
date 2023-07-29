import * as Popover from '@radix-ui/react-popover';
import React from 'react';

interface PopoverProps {
  trigger: JSX.Element;
  children: React.ReactNode;
  className?: string;
}

const PopoverUI = ({ trigger, children, className }: PopoverProps) => (
  <Popover.Root>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal className={className}>
      <Popover.Content
        className="bg-white rounded-lg px-2 py-2 border border-gray-300"
        align="end"
        sideOffset={4}
      >
        {children}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export { PopoverUI as Popover };
