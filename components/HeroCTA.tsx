'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <Button variant="primary" disabled className="w-full sm:w-auto px-8 py-4 text-lg h-auto shadow-lg opacity-80 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Memuat...
      </Button>
    );
  }

  return (
    <Link href="/dashboard" className="w-full sm:w-auto">
      <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 gap-2 flex items-center justify-center">
        {isLoggedIn ? 'Kembali ke Dashboard' : 'Mulai Gratis Sekarang'} <ArrowRight className="w-5 h-5" />
      </Button>
    </Link>
  );
}
