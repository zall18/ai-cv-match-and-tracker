'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';

function MatcherContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState<'cv' | 'job' | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    roleName: '',
    jobRequirement: '',
    cvDraft: ''
  });

  const [result, setResult] = useState<{
    match_score: number;
    missing_keywords: string[];
    actionable_feedback: string[];
  } | null>(null);

  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const jobFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && mounted) {
        router.replace('/');
      } else if (session && editId && mounted) {
        fetchApplication(editId);
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
  }, [router, editId]);

  const fetchApplication = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          companyName: data.company_name,
          roleName: data.role_name,
          jobRequirement: data.job_requirement || '',
          cvDraft: data.cv_draft || ''
        });
        // If it already had a match score, we can prepopulate result
        if (data.match_score !== null) {
          setResult({
            match_score: data.match_score,
            missing_keywords: data.missing_keywords || [],
            actionable_feedback: data.feedback || []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      alert('Gagal mengambil data lamaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'job') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang didukung saat ini.');
      return;
    }

    setParsingPdf(type);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: fd
      });

      if (!response.ok) throw new Error('Gagal mengekstrak PDF');
      
      const data = await response.json();
      
      if (type === 'cv') {
        setFormData(prev => ({ ...prev, cvDraft: data.text }));
      } else {
        setFormData(prev => ({ ...prev, jobRequirement: data.text }));
      }
      
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat membaca file PDF.');
    } finally {
      setParsingPdf(null);
      // Reset input so same file can be selected again if needed
      if (e.target) e.target.value = '';
    }
  };

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

      // Default status logic based on match score
      let targetStatus = result.match_score >= 90 ? 'Drafting' : 'Wishlist';

      if (editId) {
        // Update existing record
        // We might not want to override status if it's already past 'Drafting' (e.g. Applied, Interview)
        // Let's fetch current status first or just let the user change it manually in the dashboard.
        // For now, if we update, we just update the content and score.
        const { error } = await supabase.from('applications').update({
          company_name: formData.companyName,
          role_name: formData.roleName,
          job_requirement: formData.jobRequirement,
          cv_draft: formData.cvDraft,
          match_score: result.match_score,
          missing_keywords: result.missing_keywords,
          feedback: result.actionable_feedback,
          // We don't overwrite status on update unless we want to. We'll leave status alone on update.
        }).eq('id', editId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase.from('applications').insert({
          user_id: user.id,
          company_name: formData.companyName,
          role_name: formData.roleName,
          job_requirement: formData.jobRequirement,
          cv_draft: formData.cvDraft,
          match_score: result.match_score,
          missing_keywords: result.missing_keywords,
          feedback: result.actionable_feedback,
          status: targetStatus
        });

        if (error) throw error;
      }
      
      router.push('/tracker');
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data ke Tracker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            {editId ? 'Update Analisis CV' : 'AI CV Matcher'}
          </h1>
          <p className="text-brand-secondary">
            {editId 
              ? 'Perbarui CV atau Persyaratan Kerja untuk dianalisis ulang.' 
              : 'Audit CV Anda dengan AI untuk memastikan kesesuaian dengan persyaratan lamaran.'}
          </p>
        </div>
        {editId && (
          <Button variant="outlined" onClick={() => router.push('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        )}
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

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-semibold text-brand-primary">Job Requirement (Persyaratan Kerja)</label>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                ref={jobFileInputRef} 
                onChange={(e) => handleFileUpload(e, 'job')} 
              />
              <button 
                className="text-xs text-brand-tertiary font-medium flex items-center hover:underline"
                onClick={() => jobFileInputRef.current?.click()}
              >
                {parsingPdf === 'job' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <UploadCloud className="w-3 h-3 mr-1" />}
                {parsingPdf === 'job' ? 'Mengekstrak PDF...' : 'Unggah File PDF'}
              </button>
            </div>
            <TextArea 
              placeholder="Salin dan tempel deskripsi pekerjaan dari portal lowongan di sini..."
              className="flex-1 min-h-[250px]"
              value={formData.jobRequirement}
              onChange={(e) => setFormData({...formData, jobRequirement: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-semibold text-brand-primary">Draf CV Anda</label>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                ref={cvFileInputRef} 
                onChange={(e) => handleFileUpload(e, 'cv')} 
              />
              <button 
                className="text-xs text-brand-tertiary font-medium flex items-center hover:underline"
                onClick={() => cvFileInputRef.current?.click()}
              >
                {parsingPdf === 'cv' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <UploadCloud className="w-3 h-3 mr-1" />}
                {parsingPdf === 'cv' ? 'Mengekstrak PDF...' : 'Unggah CV (PDF)'}
              </button>
            </div>
            <TextArea 
              placeholder="Salin dan tempel teks dari CV/Resume Anda di sini..."
              className="flex-1 min-h-[250px]"
              value={formData.cvDraft}
              onChange={(e) => setFormData({...formData, cvDraft: e.target.value})}
            />
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            className="w-full py-3 text-base"
            onClick={handleAnalyze}
            disabled={loading || parsingPdf !== null}
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
                {editId 
                  ? 'Perbarui Data Lamaran' 
                  : (result.match_score >= 90 ? 'Simpan (Otomatis ke Drafting)' : 'Simpan ke Tracker (Wishlist)')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIMatcher() {
  return (
    <Suspense fallback={<div className="flex-1 p-12 text-center text-brand-secondary">Memuat...</div>}>
      <MatcherContent />
    </Suspense>
  );
}
