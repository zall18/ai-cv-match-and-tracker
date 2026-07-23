'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AIMatcher() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    roleName: '',
    jobRequirement: '',
    cvDraft: ''
  });

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && mounted) {
        router.replace('/');
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
  
  const [result, setResult] = useState<{
    match_score: number;
    missing_keywords: string[];
    actionable_feedback: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!formData.companyName || !formData.roleName || !formData.jobRequirement || !formData.cvDraft) {
      alert("Mohon lengkapi semua kolom!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: formData.jobRequirement,
          cvDraft: formData.cvDraft
        })
      });

      if (!response.ok) throw new Error('Gagal menganalisis CV');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menganalisis CV. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Anda harus login untuk menyimpan lamaran.");
        return;
      }

      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        company_name: formData.companyName,
        role_name: formData.roleName,
        job_requirement: formData.jobRequirement,
        cv_draft: formData.cvDraft,
        match_score: result.match_score,
        missing_keywords: result.missing_keywords,
        feedback: result.actionable_feedback,
        status: 'Wishlist'
      });

      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data ke Tracker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">AI CV Matcher</h1>
        <p className="text-brand-secondary">Audit CV Anda dengan AI untuk memastikan kesesuaian dengan persyaratan lamaran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Kolom Input */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Nama Perusahaan" 
              placeholder="Misal: PT GoTo Gojek Tokopedia"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
            <Input 
              label="Posisi / Peran" 
              placeholder="Misal: Frontend Engineer"
              value={formData.roleName}
              onChange={(e) => setFormData({...formData, roleName: e.target.value})}
            />
          </div>

          <TextArea 
            label="Job Requirement (Persyaratan Kerja)"
            placeholder="Salin dan tempel deskripsi pekerjaan dari portal lowongan di sini..."
            className="flex-1 min-h-[250px]"
            value={formData.jobRequirement}
            onChange={(e) => setFormData({...formData, jobRequirement: e.target.value})}
          />

          <TextArea 
            label="Draf CV Anda"
            placeholder="Salin dan tempel teks dari CV/Resume Anda di sini..."
            className="flex-1 min-h-[250px]"
            value={formData.cvDraft}
            onChange={(e) => setFormData({...formData, cvDraft: e.target.value})}
          />

          <Button 
            variant="primary" 
            size="lg" 
            className="w-full py-3 text-base"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading && !result ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {loading && !result ? 'Menganalisis dengan AI...' : 'Analisis Kecocokan'}
          </Button>
        </div>

        {/* Kolom Output / Hasil */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col">
          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center mb-6">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">Menunggu Input</h3>
              <p className="text-brand-secondary max-w-sm">Isi form di sebelah kiri dan klik "Analisis Kecocokan" untuk melihat hasil audit AI di sini.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-8">
                <div>
                  <h3 className="text-lg font-semibold text-brand-secondary uppercase tracking-wider mb-1">Match Score</h3>
                  <div className="text-5xl font-bold text-brand-primary flex items-baseline gap-1">
                    {result.match_score} <span className="text-xl text-brand-secondary">%</span>
                  </div>
                </div>
                
                {/* Circular indicator mock */}
                <div className="w-24 h-24 rounded-full border-[8px] flex items-center justify-center" 
                     style={{ borderColor: result.match_score >= 80 ? '#06B6D4' : result.match_score >= 50 ? '#F59E0B' : '#EF4444' }}>
                   <span className="font-bold text-xl">{result.match_score}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-danger" />
                  Missing Keywords
                </h3>
                {result.missing_keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> CV Anda sudah mencakup semua kata kunci teknis!
                  </p>
                )}
              </div>

              <div className="flex-1 mb-8">
                <h3 className="text-lg font-bold text-brand-primary mb-4">Actionable Feedback</h3>
                <ul className="space-y-4">
                  {result.actionable_feedback.map((fb, i) => (
                    <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="bg-brand-tertiary/10 text-brand-tertiary w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-brand-secondary text-sm leading-relaxed">{fb}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant="primary" 
                className="w-full py-4 text-base"
                onClick={handleSaveToTracker}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                Simpan ke Tracker (Wishlist)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
