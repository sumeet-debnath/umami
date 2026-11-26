import { Row } from '@umami/react-zen';
import type { ReactNode } from 'react';

export function TypeIcon({
  type,
  value,
  children,
  decorative,
}: {
  type: 'browser' | 'country' | 'device' | 'os';
  value: string;
  children?: ReactNode;
  /** the value is said beside the icon: the icon says nothing more ("Chrome", not "Chrome Chrome") */
  decorative?: boolean;
}) {
  const iconValue = type === 'browser' && value === 'browser' ? 'unknown' : value;

  return (
    <Row gap="3" alignItems="center">
      <img
        src={`${process.env.basePath || ''}/images/${type}/${
          iconValue?.replaceAll(' ', '-').toLowerCase() || 'unknown'
        }.png`}
        onError={e => {
          e.currentTarget.src = `${process.env.basePath || ''}/images/${type}/unknown.png`;
        }}
        alt={decorative ? '' : value}
        width={type === 'country' ? undefined : 16}
        height={type === 'country' ? undefined : 16}
      />
      {children}
    </Row>
  );
}
