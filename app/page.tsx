'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import TodoList from '@/components/TodoList';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = supabase.auth.getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={setUser} />;
  }

  return <TodoList user={user} onSignOut={handleSignOut} />;
}