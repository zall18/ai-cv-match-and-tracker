'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Copy, Check, Wand2, FileText, Building } from 'lucide-react';
import Link from 'next/link';

function CoverLetterGenerator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [tone, setTone] = useState<'professional' | 'casual' | 'direct'>('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplication();
    } else {
      router.replace('/tracker');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      router.replace('/tracker');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!application) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: application.job_requirement,
          cvDraft: application.cv_draft,
          language,
          tone
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Terjadi kesalahan saat membuat cover letter.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data lamaran...</div>;
  }

  if (!application) return null;

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tracker">
            <Button variant="outlined" className="p-2 h-10 w-10 shrink-0 rounded-full border-slate-200">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">AI Cover Letter Generator</h1>
            <p className="text-brand-secondary mt-1">Buat surat lamaran super personal dalam hitungan detik.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Pengaturan & Konteks */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-tertiary" /> Target Lamaran
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 font-medium">Perusahaan</span>
                <p className="font-semibold text-slate-800">{application.company_name}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Posisi</span>
                <p className="font-semibold text-slate-800">{application.role_name}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Match Score</span>
                <p className="font-bold text-brand-primary text-xl">{application.match_score}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-brand-secondary" /> Pengaturan AI
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-brand-primary mb-2">Pilih Bahasa</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${
                    language === 'en' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('id')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${
                    language === 'id' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Bahasa Indonesia
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-brand-primary mb-2">Pilih Tone / Gaya Bahasa</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTone('professional')}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${
                    tone === 'professional' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Professional & Formal
                </button>
                <button
                  onClick={() => setTone('casual')}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${
                    tone === 'casual' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Creative & Friendly
                </button>
                <button
                  onClick={() => setTone('direct')}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${
                    tone === 'direct' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Direct & Concise
                </button>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full h-12 text-base shadow-md"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Menghasilkan...' : 'Generate Cover Letter'}
            </Button>
          </div>
        </div>

        {/* Kolom Hasil / Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" /> Hasil Cover Letter
              </h3>
              <Button 
                variant="outlined" 
                className="gap-2 bg-white text-sm"
                onClick={handleCopy}
                disabled={!coverLetter}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Copy Text'}
              </Button>
            </div>
            
            <div className="flex-1 p-4 bg-white relative">
              {!coverLetter && !generating && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 p-8 text-center">
                  Klik "Generate Cover Letter" untuk mulai membuat surat lamaran profesional berdasarkan CV dan Job Requirement Anda.
                </div>
              )}
              {generating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-primary bg-white/80 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-brand-secondary/30 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                  <p className="font-bold animate-pulse">Menulis Cover Letter...</p>
                </div>
              )}
              <textarea
                className="w-full h-full resize-none p-4 focus:outline-none focus:ring-2 focus:ring-brand-tertiary rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 leading-relaxed font-sans text-sm transition-shadow"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder={generating ? "" : "Hasil surat lamaran Anda akan muncul di sini. Anda bisa mengeditnya secara manual."}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat generator...</div>}>
      <CoverLetterGenerator />
    </Suspense>
  );
}
