import { Button, Icon, Row } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { Monitor, Moon, Sun } from '@/components/icons';

export type ThemeMode = 'light' | 'dark' | 'system';

export function ThemeModeSelector({
  id,
  label,
  value,
  onChange,
  includeSystem = false,
}: {
  id?: string;
  label?: string;
  value?: ThemeMode;
  onChange: (value: ThemeMode) => void;
  includeSystem?: boolean;
}) {
  const options: { id: ThemeMode; icon: ReactNode; label: string }[] = [
    { id: 'light', icon: <Sun />, label: 'Light' },
    ...(includeSystem ? [{ id: 'system' as const, icon: <Monitor />, label: 'System' }] : []),
    { id: 'dark', icon: <Moon />, label: 'Dark' },
  ];

  return (
    <Row gap id={id} role="group" aria-label={label}>
      {options.map(({ id, icon, label }) => (
        <Button
          key={id}
          variant={value === id ? 'primary' : undefined}
          onPress={() => onChange(id)}
          aria-label={label}
          aria-pressed={value === id}
        >
          <Icon>{icon}</Icon>
        </Button>
      ))}
    </Row>
  );
}
