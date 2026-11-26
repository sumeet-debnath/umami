import {
  Button,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  TextField,
} from '@umami/react-zen';
import { useMessages } from '@/components/hooks';

export function TypeConfirmationForm({
  confirmationValue,
  buttonLabel,
  buttonVariant,
  isLoading,
  error,
  onConfirm,
  onClose,
  buttonProps,
}: {
  confirmationValue: string;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'outline' | 'quiet' | 'danger' | 'zero';
  isLoading?: boolean;
  error?: string | Error;
  onConfirm?: () => void;
  onClose?: () => void;
  buttonProps?: Record<string, string>;
}) {
  const { t, labels, messages, getErrorMessage } = useMessages();
  if (!confirmationValue) {
    return null;
  }

  return (
    <Form onSubmit={onConfirm} error={getErrorMessage(error)}>
      <p>
        {t(messages.actionConfirmation, {
          confirmation: confirmationValue,
        })}
      </p>
      <FormField
        label={t(labels.confirm)}
        name="confirm"
        rules={{ validate: value => value === confirmationValue }}
      >
        <TextField autoComplete="off" />
      </FormField>
      <FormButtons>
        <Button onPress={onClose}>{t(labels.cancel)}</Button>
        <FormSubmitButton {...buttonProps} isLoading={isLoading} variant={buttonVariant}>
          {buttonLabel || t(labels.ok)}
        </FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
