import { Button, Dialog, DialogTrigger, Icon, Modal, Text, useToast } from '@umami/react-zen';
import { useMessages, useModified } from '@/components/hooks';
import { Plus } from '@/components/icons';
import { TeamMemberAddForm } from './TeamMemberAddForm';
import { savedToastMessage } from '@/components/common/SavedToast';

export function TeamsMemberAddButton({
  teamId,
  onSave,
}: {
  teamId: string;
  onSave?: () => void;
  isAdmin?: boolean;
}) {
  const { t, labels, messages } = useMessages();
  const { toast } = useToast();
  const { touch } = useModified();

  const handleSave = async () => {
    toast(savedToastMessage(t(messages.saved), t(messages.itemSaved, { item: t(labels.member) })));
    touch('teams:members');
    onSave?.();
  };

  return (
    <DialogTrigger>
      <Button>
        <Icon>
          <Plus />
        </Icon>
        <Text>{t(labels.addMember)}</Text>
      </Button>
      <Modal>
        <Dialog title={t(labels.addMember)} style={{ width: 400 }}>
          {({ close }) => <TeamMemberAddForm teamId={teamId} onSave={handleSave} onClose={close} />}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
