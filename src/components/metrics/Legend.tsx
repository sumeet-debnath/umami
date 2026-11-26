import { Row, StatusLight, Text } from '@umami/react-zen';
import type { LegendItem } from 'chart.js/auto';
import { colord } from 'colord';
import { useMessages } from '@/components/hooks';

export function Legend({
  items = [],
  onClick,
}: {
  items: any[];
  onClick: (index: LegendItem) => void;
}) {
  const { t, labels } = useMessages();

  if (!items.find(({ text }) => text)) {
    return null;
  }

  return (
    <Row gap wrap="wrap" justifyContent="center" role="group" aria-label={t(labels.legend)}>
      {items.map(item => {
        const { text, fillStyle, hidden } = item;
        const color = colord(fillStyle);

        return (
          <Row key={text} onClick={() => onClick(item)} role="button" aria-pressed={!hidden}>
            <StatusLight color={color.alpha(color.alpha() + 0.2).toHex()}>
              <Text
                size="sm"
                color={hidden ? 'disabled' : undefined}
                truncate={true}
                style={{ maxWidth: '300px' }}
              >
                {text}
              </Text>
            </StatusLight>
          </Row>
        );
      })}
    </Row>
  );
}
