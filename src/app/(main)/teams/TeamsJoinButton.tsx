import { Button, Dialog, DialogTrigger, Icon, Modal, Text, useToast } from '@umami/react-zen';
import { useMessages, useModified } from '@/components/hooks';
import { UserPlus } from '@/components/icons';
import { TeamJoinForm } from './TeamJoinForm';
import { savedToastMessage } from '@/components/common/SavedToast';

export function TeamsJoinButton() {
  const { t, labels, messages } = useMessages();
  const { toast } = useToast();
  const { touch } = useModified();

  const handleJoin = () => {
    toast(savedToastMessage(t(messages.saved), t(messages.itemSaved, { item: t(labels.team) })));
    touch('teams');
  };

  return (
    <DialogTrigger>
      <Button data-agentom-risk="sensitive">
        <Icon>
          <UserPlus />
        </Icon>
        <Text>{t(labels.joinTeam)}</Text>
      </Button>
      <Modal>
        <Dialog title={t(labels.joinTeam)} style={{ width: 400 }}>
          {({ close }) => <TeamJoinForm onSave={handleJoin} onClose={close} />}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
