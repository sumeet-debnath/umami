import {
  Button,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  PasswordField,
} from '@umami/react-zen';
import { useMessages, useUpdateQuery } from '@/components/hooks';

export function PasswordEditForm({ onSave, onClose }) {
  const { t, labels, messages, getErrorMessage } = useMessages();
  const { mutateAsync, error, isPending } = useUpdateQuery('/me/password');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async () => {
        onSave();
        onClose();
      },
    });
  };

  const samePassword = (value: string, values: Record<string, any>) => {
    if (value !== values.newPassword) {
      return t(messages.noMatchPassword);
    }
    return true;
  };

  return (
    <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
      <FormField
        label={t(labels.currentPassword)}
        name="currentPassword"
        rules={{ required: 'Required' }}
      >
        <PasswordField
          aria-required="true"
          autoComplete="current-password"
          aria-label={t(labels.currentPassword)}
        />
      </FormField>
      <FormField
        name="newPassword"
        label={t(labels.newPassword)}
        rules={{
          required: 'Required',
          minLength: { value: 8, message: t(messages.minPasswordLength, { n: '8' }) },
        }}
      >
        <PasswordField
          aria-required="true"
          autoComplete="new-password"
          aria-label={t(labels.newPassword)}
        />
      </FormField>
      <FormField
        name="confirmPassword"
        label={t(labels.confirmPassword)}
        rules={{
          required: t(labels.required),
          minLength: { value: 8, message: t(messages.minPasswordLength, { n: '8' }) },
          validate: samePassword,
        }}
      >
        <PasswordField
          aria-required="true"
          autoComplete="new-password"
          aria-label={t(labels.confirmPassword)}
        />
      </FormField>
      <FormButtons>
        <Button onPress={onClose}>{t(labels.cancel)}</Button>
        <FormSubmitButton isDisabled={isPending}>{t(labels.save)}</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
