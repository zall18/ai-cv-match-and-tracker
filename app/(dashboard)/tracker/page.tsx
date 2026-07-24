'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit2, FileText } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

type Application = {
  id: string;
  company_name: string;
  role_name: string;
  match_score: number;
  status: 'Wishlist' | 'Drafting' | 'Applied' | 'Interview' | 'Accepted' | 'Rejected';
};

const COLUMNS = [
  { id: 'Wishlist', label: 'Wishlist', bg: 'bg-slate-100/50 backdrop-blur-md', border: 'border-slate-200/50' },
  { id: 'Drafting', label: 'Drafting', bg: 'bg-blue-50/50 backdrop-blur-md', border: 'border-blue-100/50' },
  { id: 'Applied', label: 'Applied', bg: 'bg-purple-50/50 backdrop-blur-md', border: 'border-purple-100/50' },
  { id: 'Interview', label: 'Interview', bg: 'bg-yellow-50/50 backdrop-blur-md', border: 'border-yellow-200/50' },
  { id: 'Accepted', label: 'Accepted 🎉', bg: 'bg-emerald-50/50 backdrop-blur-md', border: 'border-emerald-200/50' },
  { id: 'Rejected', label: 'Rejected', bg: 'bg-red-50/50 backdrop-blur-md', border: 'border-red-200/50' }
] as const;

export default function Tracker() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (mounted) router.replace('/');
      } else {
        if (mounted) fetchApplications(session.user.id);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && mounted) {
        router.replace('/');
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchApplications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lamaran ini?')) return;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('applicationId', id);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Application['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (!id) return;

    // Trigger confetti if accepted
    if (newStatus === 'Accepted') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Optimistic Update
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert if failed by refetching
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchApplications(session.user.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 p-8 max-w-[1600px] mx-auto w-full relative">
      {/* Decorative background element for glassmorphism */}
      <div className="absolute top-20 left-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-40 w-96 h-96 bg-brand-tertiary/10 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Kanban Tracker</h1>
          <p className="text-brand-secondary mt-1">Pindahkan kartu untuk memperbarui status lamaran Anda</p>
        </div>
        <Link href="/matcher">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Lamaran Baru
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-brand-secondary py-20">Memuat data...</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 items-start h-[calc(100vh-200px)]">
          {COLUMNS.map(column => (
            <div 
              key={column.id} 
              className={`${column.bg} border ${column.border} rounded-xl p-4 min-w-[300px] max-w-[300px] h-full overflow-y-auto transition-colors`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4 px-2 sticky top-0 bg-white/50 backdrop-blur-md py-2 rounded-lg z-10 shadow-sm border border-white/20">
                <h3 className="font-bold text-slate-800">{column.label}</h3>
                <span className="bg-white/80 text-slate-700 border border-slate-200 text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                  {applications.filter(a => a.status === column.id).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {applications.filter(a => a.status === column.id).map(app => (
                  <div 
                    key={app.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 group relative cursor-grab active:cursor-grabbing hover:shadow-md hover:border-brand-tertiary/50 transition-all duration-300"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1 rounded-md shadow-sm border border-slate-100">
                      <button 
                        onClick={() => router.push(`/cover-letter?id=${app.id}`)}
                        className="p-1.5 text-slate-400 hover:text-brand-primary rounded"
                        title="Buat Cover Letter"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/matcher?id=${app.id}`)}
                        className="p-1.5 text-slate-400 hover:text-brand-tertiary rounded"
                        title="Edit Lamaran"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteApplication(app.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                        title="Hapus Lamaran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs font-semibold text-brand-tertiary mb-1">{app.company_name}</div>
                    <div className="font-bold text-brand-primary leading-tight mb-3 pr-20">{app.role_name}</div>
                    {app.match_score > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-tertiary rounded-full transition-all duration-1000" 
                            style={{ width: `${app.match_score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-brand-secondary">{app.match_score}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
