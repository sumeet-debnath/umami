import {
  Button,
  type DialogRenderProps,
  DialogTrigger,
  Icon,
  Sheet,
  type SheetProps,
  SheetTitle,
} from '@umami/react-zen';
import { type ReactNode, useState } from 'react';
import { useMessages } from '@/components/hooks';
import { Menu } from '@/components/icons';

export interface MobileMenuButtonProps extends Omit<SheetProps, 'children' | 'side'> {
  children?: ReactNode | ((props: DialogRenderProps) => ReactNode);
}

export function MobileMenuButton({
  children,
  isOpen: controlledOpen,
  onOpenChange,
  ...props
}: MobileMenuButtonProps) {
  const { t, labels } = useMessages();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const handleOpenChange = (open: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(open);
    }
    onOpenChange?.(open);
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button aria-label={t(labels.openMenu)}>
        <Icon>
          <Menu />
        </Icon>
      </Button>
      <Sheet {...props} side="left">
        <SheetTitle className="sr-only">{t(labels.navigation)}</SheetTitle>
        {typeof children === 'function'
          ? children({ close: () => handleOpenChange(false) })
          : children}
      </Sheet>
    </DialogTrigger>
  );
}
