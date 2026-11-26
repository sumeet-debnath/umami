'use client';
import { Column, Loading } from '@umami/react-zen';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginQuery } from '@/components/hooks';
import { getScreenName } from '@/lib/semantic-screen';
import { LoginForm } from './LoginForm';
import { PropsWithChildren } from 'react';

export function LoginPageWrapper({ children }: PropsWithChildren) {
  const { user, isLoading } = useLoginQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (isLoading || user) {
    return <Loading placement="absolute" />;
  }

  return (
    <Column
      alignItems="center"
      justifyContent="flex-start"
      height="100vh"
      backgroundColor="surface-raised"
      style={{ paddingTop: '15vh' }}
      data-agentom-screen={getScreenName(pathname)}
      data-agentom-state="ready"
    >
      {children}
    </Column>
  );
}

export function LoginPage() {
  return (
    <LoginPageWrapper>
      <LoginForm />
    </LoginPageWrapper>
  );
}
