import { useTheme } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { ThemeModeSelector } from '@/components/input/ThemeModeSelector';

export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const { t, labels } = useMessages();

  return (
    <ThemeModeSelector
      label={t(labels.theme)}
      value={theme}
      onChange={value => setTheme(value as 'light' | 'dark')}
    />
  );
}
