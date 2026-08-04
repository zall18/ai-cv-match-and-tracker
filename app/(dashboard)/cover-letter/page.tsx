'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Copy, Check, Wand2, FileText, Building, Download, Save, Printer } from 'lucide-react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

function CoverLetterGenerator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [tone, setTone] = useState<'professional' | 'casual' | 'direct'>('professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      if (data.cover_letter) {
        setCoverLetter(data.cover_letter);
      }
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
          tone,
          customInstructions
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

  const handleSaveToDB = async () => {
    if (!application || !coverLetter) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ cover_letter: coverLetter })
        .eq('id', application.id);
        
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving cover letter:', error);
      alert('Gagal menyimpan cover letter. Pastikan skema database sudah diupdate.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetter) return;
    const doc = new jsPDF();
    
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(coverLetter, 170);
    doc.text(lines, 20, 20);
    
    doc.save(`Cover_Letter_${application?.company_name || 'Application'}.pdf`);
  };

  const handleDownloadWord = async () => {
    if (!coverLetter) return;
    
    const paragraphs = coverLetter.split('\n').map(line => 
      new Paragraph({
        children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })] // size 24 is 12pt
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${application?.company_name || 'Application'}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!coverLetter) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Cover Letter</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; padding: 40px; line-height: 1.6; white-space: pre-wrap; font-size: 12pt; }
            </style>
          </head>
          <body>${coverLetter}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
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

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-brand-secondary" /> Pengaturan AI
            </h3>
            
            <div>
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
                  Indonesia
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Pilih Tone / Gaya</label>
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

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">Instruksi Tambahan (Opsional)</label>
              <textarea
                className="w-full resize-none p-3 focus:outline-none focus:ring-2 focus:ring-brand-tertiary rounded-xl border border-slate-200 text-sm text-slate-700"
                rows={3}
                placeholder="Contoh: Tekankan pengalaman saya memimpin tim..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>

            <Button 
              variant="primary" 
              className="w-full h-12 text-base shadow-md mt-2"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Menulis Surat...' : 'Generate Cover Letter'}
            </Button>
          </div>
        </div>

        {/* Kolom Hasil / Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[700px] overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" /> Editor & Preview
              </h3>
              
              {/* Toolbar Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outlined" 
                  className="gap-2 bg-white text-xs h-9 px-3"
                  onClick={handleSaveToDB}
                  disabled={!coverLetter || saving}
                >
                  {saved ? <Check className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : saved ? 'Tersimpan' : 'Simpan'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  className="gap-2 bg-white text-xs h-9 px-3"
                  onClick={handleCopy}
                  disabled={!coverLetter}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  Copy
                </Button>

                <Button 
                  variant="outlined" 
                  className="gap-2 bg-white text-xs h-9 px-3 text-slate-700"
                  onClick={handlePrint}
                  disabled={!coverLetter}
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                
                <Button 
                  variant="primary" 
                  className="gap-2 text-xs h-9 px-3 bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={handleDownloadPDF}
                  disabled={!coverLetter}
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>

                <Button 
                  variant="primary" 
                  className="gap-2 text-xs h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white border-none"
                  onClick={handleDownloadWord}
                  disabled={!coverLetter}
                >
                  <Download className="w-4 h-4" />
                  Word
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 bg-slate-100 relative overflow-hidden flex flex-col items-center">
              {!coverLetter && !generating && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 p-8 text-center bg-white z-0">
                  Klik "Generate Cover Letter" untuk mulai membuat surat lamaran profesional berdasarkan CV dan Job Requirement Anda.
                </div>
              )}
              {generating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-primary bg-white/80 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-brand-secondary/30 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                  <p className="font-bold animate-pulse">AI sedang menulis Cover Letter Anda...</p>
                </div>
              )}
              
              {/* Paper styling for editor */}
              <div className="w-full max-w-[210mm] flex-1 bg-white shadow-md rounded-sm border border-slate-200 my-2 overflow-hidden flex flex-col relative z-0">
                <textarea
                  className="flex-1 resize-none p-10 focus:outline-none text-slate-800 leading-relaxed font-serif text-[11pt]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={generating ? "" : "Hasil surat lamaran Anda akan muncul di sini. Anda bisa mengeditnya secara manual."}
                />
              </div>
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
