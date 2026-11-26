import { Button, DialogTrigger, Icon, Menu, Popover, PopoverTitle } from '@umami/react-zen';
import {
  Children,
  cloneElement,
  isValidElement,
  type Key,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Ellipsis } from '@/components/icons';

export function MenuButton({
  children,
  onAction,
  isDisabled,
  label,
}: {
  children: ReactNode;
  onAction?: (action: string) => void;
  isDisabled?: boolean;
  label?: string;
}) {
  const handleAction = (key: Key) => {
    onAction?.(key.toString());
  };

  return (
    <DialogTrigger>
      <Button variant="quiet" isDisabled={isDisabled} aria-label={label} aria-haspopup="menu">
        <Icon>
          <Ellipsis />
        </Icon>
      </Button>
      <Popover side="bottom" align="start">
        {label && <PopoverTitle className="sr-only">{label}</PopoverTitle>}
        <Menu aria-label={label ?? 'menu'} style={{ minWidth: '140px' }}>
          {Children.map(children, child => {
            if (!isValidElement(child)) {
              return child;
            }

            const menuChild = child as ReactElement<{ onAction?: (key: Key) => void }>;

            return cloneElement(menuChild, {
              onAction: (key: Key) => {
                menuChild.props.onAction?.(key);
                handleAction(key);
              },
            });
          })}
        </Menu>
      </Popover>
    </DialogTrigger>
  );
}
