'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/Button';
import { Session } from '@supabase/supabase-js';

export function GoogleLoginButton() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <Link href="/dashboard">
        <Button variant="primary">
          Dashboard
        </Button>
      </Link>
    );
  }

  return (
    <Button onClick={handleLogin} variant="primary">
      Masuk dengan Google
    </Button>
  );
}
