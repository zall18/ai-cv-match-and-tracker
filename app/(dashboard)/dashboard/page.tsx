'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Application = {
  id: string;
  company_name: string;
  role_name: string;
  match_score: number;
  status: 'Wishlist' | 'Drafting' | 'Applied' | 'Interview';
};

const COLUMNS = ['Wishlist', 'Drafting', 'Applied', 'Interview'] as const;

export default function Dashboard() {
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
    // e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Application['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (!id) return;

    // Update state locally first for instant feedback (Optimistic Update)
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert if failed
      fetchApplications();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Kanban Tracker</h1>
          <p className="text-brand-secondary mt-1">Kelola dan pantau proses lamaran kerja Anda</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {COLUMNS.map(column => (
            <div 
              key={column} 
              className="bg-slate-100 rounded-xl p-4 min-h-[500px] transition-colors border-2 border-transparent hover:border-slate-300"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-brand-primary">{column}</h3>
                <span className="bg-slate-200 text-brand-secondary text-xs px-2 py-1 rounded-full font-medium">
                  {applications.filter(a => a.status === column).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 h-full">
                {applications.filter(a => a.status === column).map(app => (
                  <div 
                    key={app.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group relative cursor-grab active:cursor-grabbing hover:border-brand-tertiary transition-colors"
                  >
                    <button 
                      onClick={() => deleteApplication(app.id)}
                      className="absolute top-3 right-3 text-slate-300 hover:text-brand-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-xs font-semibold text-brand-tertiary mb-1">{app.company_name}</div>
                    <div className="font-bold text-brand-primary leading-tight mb-3 pr-6">{app.role_name}</div>
                    {app.match_score > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-tertiary rounded-full" 
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
