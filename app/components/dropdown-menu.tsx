import * as Dropdown from '@radix-ui/react-dropdown-menu';
import React from 'react';

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu = ({
  trigger,
  children,
  className,
}: DropdownMenuProps) => (
  <Dropdown.Root>
    <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>
    <Dropdown.Portal className={className}>
      <Dropdown.Content
        className="bg-white rounded-lg px-2 py-2 border border-gray-300"
        align="end"
        sideOffset={4}
      >
        {children}
      </Dropdown.Content>
    </Dropdown.Portal>
  </Dropdown.Root>
);

DropdownMenu.Item = Dropdown.Item;
