'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Send, MessageSquare, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Feedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  advice: string;
};

function InterviewSession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const MAX_QUESTIONS = 8;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchApplication();
    } else {
      router.replace('/tracker');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const startInterview = async () => {
    if (!application) return;
    setChatLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: application.job_requirement,
          cvDraft: application.cv_draft,
          messages: [],
          isFinished: false
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages([{ role: 'assistant', content: data.reply }]);
        setQuestionCount(1);
      }
    } catch (error) {
      console.error('Failed to start interview', error);
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatLoading || feedback) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setChatLoading(true);

    try {
      // Check if we have reached max questions. 
      // If the current question count is MAX_QUESTIONS, this user answer is the final one.
      const isFinishing = questionCount >= MAX_QUESTIONS;

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: application.job_requirement,
          cvDraft: application.cv_draft,
          messages: newMessages,
          isFinished: isFinishing
        }),
      });
      
      const data = await response.json();
      
      if (isFinishing) {
        setFeedback(data);
        if (data.score >= 80) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        setQuestionCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setChatLoading(false);
    }
  };

  const endInterviewEarly = async () => {
    if (!confirm('Apakah Anda yakin ingin mengakhiri sesi dan melihat hasilnya sekarang?')) return;
    setChatLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRequirement: application.job_requirement,
          cvDraft: application.cv_draft,
          messages: messages,
          isFinished: true
        }),
      });
      const data = await response.json();
      setFeedback(data);
      if (data.score >= 80) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } catch (error) {
      console.error('Failed to end interview', error);
      alert('Gagal mendapatkan hasil. Coba lagi.');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data lamaran...</div>;
  }

  if (!application) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/tracker">
            <Button variant="outlined" className="p-2 h-10 w-10 shrink-0 rounded-full border-slate-200">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">AI Mock Interview</h1>
            <p className="text-sm md:text-base text-brand-secondary mt-1">
              {application.role_name} di {application.company_name}
            </p>
          </div>
        </div>
        {messages.length > 0 && !feedback && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Pertanyaan {questionCount} / {MAX_QUESTIONS}
            </span>
            <Button variant="outlined" onClick={endInterviewEarly} className="text-red-500 border-red-200 hover:bg-red-50 hidden sm:flex">
              Akhiri Sesi
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Siap untuk Latihan?</h2>
            <p className="text-slate-600 max-w-md mb-8">
              AI akan memberikan maksimal <strong>{MAX_QUESTIONS} pertanyaan</strong> yang dirancang khusus berdasarkan CV Anda dan Job Requirement posisi ini. Jawab dengan jujur dan profesional seolah-olah Anda sedang wawancara nyata.
            </p>
            <Button variant="primary" onClick={startInterview} disabled={chatLoading} className="h-12 px-8 text-lg">
              {chatLoading ? 'Menyiapkan...' : 'Mulai Interview Sekarang'}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-brand-primary text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="text-xs font-bold text-brand-tertiary mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> HR Interviewer
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {chatLoading && !feedback && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Feedback Screen Overlay */}
            {feedback && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col p-6 md:p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full">
                  <h2 className="text-3xl font-extrabold text-brand-primary mb-2 text-center">Hasil Evaluasi Interview</h2>
                  <p className="text-center text-slate-500 mb-8">Berdasarkan percakapan Anda dengan AI Interviewer</p>
                  
                  <div className="flex justify-center mb-10">
                    <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative shadow-inner">
                      <div className="absolute inset-0 rounded-full border-8 border-brand-tertiary" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${100 - feedback.score}%, 0 ${100 - feedback.score}%)`, rotate: '180deg' }}></div>
                      <span className="text-4xl font-black text-brand-primary z-10">{feedback.score}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                      <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-emerald-500" /> Yang Sudah Bagus
                      </h3>
                      <ul className="space-y-3">
                        {feedback.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                      <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-orange-500" /> Area Peningkatan
                      </h3>
                      <ul className="space-y-3">
                        {feedback.improvements.map((imp, i) => (
                          <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-primary/10 mb-8">
                    <h3 className="font-bold text-brand-primary flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-brand-tertiary" /> Saran AI
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {feedback.advice}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 pb-12">
                    <Button variant="outlined" onClick={() => router.push('/tracker')}>Kembali ke Tracker</Button>
                    <Button variant="primary" onClick={() => window.location.reload()}>Coba Lagi</Button>
                  </div>
                </div>
              </div>
            )}

            {!feedback && (
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik jawaban Anda di sini..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-brand-tertiary transition-shadow bg-slate-50"
                    disabled={chatLoading}
                  />
                  <Button type="submit" variant="primary" disabled={!input.trim() || chatLoading} className="px-6 rounded-xl">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <div className="sm:hidden mt-2 text-center">
                  <button onClick={endInterviewEarly} className="text-xs text-red-500 font-medium">Akhiri Sesi Sekarang</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat sesi interview...</div>}>
      <InterviewSession />
    </Suspense>
  );
}
