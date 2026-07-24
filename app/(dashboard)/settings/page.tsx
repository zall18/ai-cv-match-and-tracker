'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/Button';
import { Trash2, User, Mail, Shield, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-pulse text-brand-secondary">Memuat profil...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-red-500">Anda belum login.</div>
      </div>
    );
  }

  const { user } = session;
  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || 'Pengguna CV Matcher';
  const email = user.email;

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">Pengaturan & Profil</h1>
        <p className="text-brand-secondary mt-2">Kelola informasi pribadi dan preferensi akun Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-secondary" />
              <h2 className="font-semibold text-brand-primary">Informasi Pribadi</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-primary">{fullName}</h3>
                  <div className="flex items-center gap-2 text-brand-secondary mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Akun Terverifikasi (Google)
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={fullName}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Nama ditarik otomatis dari akun Google Anda.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="text" 
                    value={email}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-red-50/50 rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-red-600">Zona Berbahaya</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-red-800 mb-6 leading-relaxed">
                Menghapus akun Anda akan menghapus semua data lamaran, history CV, dan cover letter yang tersimpan secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              <Button 
                variant="outlined" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 flex items-center justify-center gap-2"
                onClick={() => alert("Fitur Hapus Akun akan segera hadir pada update berikutnya!")}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Akun
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
