import { Text } from '@umami/react-zen';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { useLocale, useTimezone } from '@/components/hooks';
import { isInvalidDate } from '@/lib/date';

export function DateDistance({ date }: { date: Date }) {
  const { formatTimezoneDate } = useTimezone();
  const { dateLocale } = useLocale();

  if (isInvalidDate(date)) {
    return null;
  }

  // As precise as the distance shown: the minute while it's in minutes or hours ("about 7 hours
  // ago"), the day once it's in days or more ("3 days ago").
  const dateTime =
    Math.abs(differenceInMinutes(new Date(), date)) < 24 * 60
      ? `${date.toISOString().slice(0, 16)}Z`
      : formatTimezoneDate(date.toISOString(), 'yyyy-MM-dd');

  return (
    <Text
      render={<time dateTime={dateTime} />}
      title={formatTimezoneDate(date?.toISOString(), 'PPPpp')}
    >
      {formatDistanceToNow(date, { addSuffix: true, locale: dateLocale })}
    </Text>
  );
}
