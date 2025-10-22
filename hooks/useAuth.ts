// hooks/useAuth.ts
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    session: session,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    status,
  };
}