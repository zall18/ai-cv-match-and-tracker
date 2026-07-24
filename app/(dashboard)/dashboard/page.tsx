'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Target, CheckCircle, TrendingUp, Clock, FileText } from 'lucide-react';

type Application = {
  id: string;
  company_name: string;
  role_name: string;
  match_score: number;
  status: 'Wishlist' | 'Drafting' | 'Applied' | 'Interview' | 'Accepted' | 'Rejected';
  created_at: string;
};

export default function DashboardOverview() {
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
    checkAuth();
    return () => { mounted = false; };
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

  // Kalkulasi Statistik
  const totalApplied = applications.filter(app => !['Wishlist', 'Drafting'].includes(app.status)).length;
  const successApps = applications.filter(app => ['Interview', 'Accepted'].includes(app.status)).length;
  const successRate = totalApplied > 0 ? Math.round((successApps / totalApplied) * 100) : 0;
  
  const scores = applications.filter(app => app.match_score > 0).map(app => app.match_score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full text-brand-secondary">Memuat metrik...</div>;
  }

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-primary">Dashboard Overview</h1>
        <p className="text-brand-secondary mt-1">Pantau performa dan tingkat kesuksesan lamaran Anda.</p>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Terkirim</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalApplied} <span className="text-sm font-normal text-slate-400">lamaran</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Success Rate (Interview/Lolos)</p>
            <h3 className="text-3xl font-bold text-slate-800">{successRate}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-brand-tertiary/10 text-brand-tertiary rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Rata-rata Match Score</p>
            <h3 className="text-3xl font-bold text-slate-800">{avgScore}%</h3>
          </div>
        </div>
      </div>

      {/* Aktivitas Terakhir */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Aktivitas Terakhir
        </h2>
        
        {applications.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Belum ada aktivitas lamaran.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {applications.slice(0, 5).map((app) => {
              const date = new Date(app.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              });
              
              return (
                <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{app.role_name}</h4>
                      <p className="text-sm text-slate-500">{app.company_name} • <span className="text-brand-tertiary font-medium">Match: {app.match_score}%</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      Status: {app.status}
                    </span>
                    <span className="text-xs text-slate-400">{date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
