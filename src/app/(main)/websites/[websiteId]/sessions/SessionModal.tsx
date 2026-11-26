'use client';
import { Column, Dialog, Modal, type ModalProps } from '@umami/react-zen';
import { SessionProfile } from '@/app/(main)/websites/[websiteId]/sessions/SessionProfile';
import { ControlledDialog } from '@/components/common/ControlledDialog';
import {
  useFormat,
  useMessages,
  useMobile,
  useNavigation,
  useWebsiteSessionQuery,
} from '@/components/hooks';
import styles from './SessionModal.module.css';

export interface SessionModalProps extends ModalProps {
  websiteId: string;
}

export function SessionModal({ websiteId, className, ...props }: SessionModalProps) {
  const {
    router,
    pathname,
    query: { session },
    updateParams,
  } = useNavigation();
  const { isMobile } = useMobile();
  const isSharePage = pathname.includes('/share/');
  const { t, messages } = useMessages();
  const { formatValue } = useFormat();
  const { data: sessionData } = useWebsiteSessionQuery(websiteId, session);
  const dialogLabel = sessionData
    ? t(messages.sessionFrom, {
        country: formatValue(sessionData.country, 'country'),
        browser: formatValue(sessionData.browser, 'browser'),
        os: formatValue(sessionData.os, 'os'),
      })
    : undefined;
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.replace(updateParams({ session: undefined }), { scroll: false });
    }
  };

  return (
    <ControlledDialog>
      <Modal
        className={[styles.modal, className].filter(Boolean).join(' ')}
        isOpen={!!session}
        onOpenChange={handleOpenChange}
        {...props}
      >
        <Column height="100%">
          <Dialog className="h-full rounded-lg" aria-label={dialogLabel}>
            {({ close }) => (
              <Column padding={isMobile ? '6' : '10'} minWidth="0" width="100%">
                <SessionProfile
                  websiteId={websiteId}
                  sessionId={session}
                  showReplays={!isSharePage}
                  onClose={() => close()}
                />
              </Column>
            )}
          </Dialog>
        </Column>
      </Modal>
    </ControlledDialog>
  );
}
