import { ConfirmationForm } from '@/components/common/ConfirmationForm';
import { useDeleteQuery, useMessages } from '@/components/hooks';
import { Trash } from '@/components/icons';
import { DialogButton } from '@/components/input/DialogButton';

export function AnnotationDeleteButton({
  annotationId,
  websiteId,
  onSave,
}: {
  annotationId: string;
  websiteId: string;
  onSave?: () => void;
}) {
  const { t, labels, messages } = useMessages();
  const { mutateAsync, isPending, error, touch } = useDeleteQuery(
    `/websites/${websiteId}/annotations/${annotationId}`,
  );

  const handleConfirm = async (close: () => void) => {
    await mutateAsync(null, {
      onSuccess: () => {
        touch('annotations');
        onSave?.();
        close();
      },
    });
  };

  return (
    <DialogButton
      data-agentom-risk="destructive"
      data-agentom-confirmation="required"
      icon={<Trash />}
      aria-label={t(labels.deleteItem, { name: t(labels.note) })}
      variant="quiet"
      title={t(labels.confirm)}
      width="400px"
    >
      {({ close }) => (
        <ConfirmationForm
          buttonProps={{ 'data-agentom-risk': 'destructive' }}
          message={t(messages.confirmDelete, { target: t(labels.note) })}
          isLoading={isPending}
          error={error}
          onConfirm={handleConfirm.bind(null, close)}
          onClose={close}
          buttonLabel={t(labels.delete)}
          buttonVariant="danger"
        />
      )}
    </DialogButton>
  );
}
