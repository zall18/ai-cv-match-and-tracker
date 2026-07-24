import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wand2, LayoutDashboard, Target, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full flex flex-col items-center justify-center min-h-[90vh] px-4 py-20 text-center">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="animate-fade-in-up flex flex-col items-center z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-tertiary/20 text-brand-tertiary font-bold mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-tertiary animate-pulse"></span>
            CV Matcher V2 Kini Tersedia
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-primary mb-6 tracking-tight leading-tight">
            Berhenti Melamar <br className="hidden md:block"/> 
            Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tertiary to-purple-600">CV Generik.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Platform pelacak lamaran cerdas yang dilengkapi AI untuk memastikan resume Anda 100% selaras dengan kualifikasi perusahaan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 gap-2">
                Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Abstract CSS Dashboard Mockup (Floating) */}
        <div className="relative w-full max-w-4xl mx-auto mt-20 h-64 md:h-96 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {/* Main Window */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-white/40 rounded-t-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex gap-4 h-full">
              {/* Sidebar abstract */}
              <div className="w-1/4 bg-slate-100/50 rounded-xl h-full hidden md:block border border-slate-200/50"></div>
              {/* Kanban Abstract */}
              <div className="flex-1 flex gap-4 h-full relative">
                {/* Column 1 */}
                <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-100/50 p-2">
                  <div className="w-20 h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="w-full h-24 bg-white rounded-lg shadow-sm mb-2 animate-float"></div>
                  <div className="w-full h-24 bg-white rounded-lg shadow-sm animate-float-delayed"></div>
                </div>
                {/* Column 2 */}
                <div className="flex-1 bg-brand-tertiary/5 rounded-xl border border-brand-tertiary/10 p-2 relative">
                  <div className="w-24 h-4 bg-brand-tertiary/30 rounded mb-4"></div>
                  <div className="w-full h-32 bg-white rounded-lg shadow-sm border border-brand-tertiary/20 flex flex-col p-3 z-10 animate-float">
                    <div className="w-1/2 h-3 bg-slate-200 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-slate-800 rounded mb-4"></div>
                    <div className="w-full h-2 bg-brand-tertiary/30 rounded-full mt-auto">
                      <div className="w-3/4 h-full bg-brand-tertiary rounded-full"></div>
                    </div>
                  </div>
                </div>
                {/* Column 3 */}
                <div className="flex-1 bg-emerald-50/50 rounded-xl border border-emerald-100/50 p-2 hidden sm:block">
                  <div className="w-20 h-4 bg-emerald-200 rounded mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="w-full bg-slate-50 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-brand-primary mb-4">Kenapa Memilih CV Matcher?</h2>
            <p className="text-lg text-slate-600">Alat super lengkap untuk meretas proses rekrutmen modern.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Feature 1: Large Card */}
            <div className="md:col-span-2 md:row-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-tertiary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="w-14 h-14 bg-brand-tertiary/10 text-brand-tertiary rounded-2xl flex items-center justify-center mb-6">
                  <Wand2 className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3">AI Cover Letter Generator</h3>
                <p className="text-slate-600 text-lg max-w-lg">Biar AI yang merangkai kata. Dapatkan surat lamaran super personal dalam hitungan detik berdasarkan CV dan kualifikasi impian Anda.</p>
              </div>
            </div>

            {/* Feature 2: Tall Card */}
            <div className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-brand-primary to-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl relative overflow-hidden text-white group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-white/10 text-brand-tertiary rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Kanban Tracker</h3>
                <p className="text-slate-300 text-lg mb-8">Pindahkan kartu dari Wishlist ke Accepted dengan antarmuka dinamis dan rapi.</p>
                
                {/* Mockup visual */}
                <div className="mt-auto space-y-3 opacity-90 group-hover:translate-y-2 transition-transform duration-500">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                    <div>
                      <div className="w-20 h-2 bg-white/40 rounded mb-2"></div>
                      <div className="w-32 h-2 bg-white/20 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                    <div>
                      <div className="w-24 h-2 bg-white/40 rounded mb-2"></div>
                      <div className="w-20 h-2 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Medium Card */}
            <div className="md:col-span-2 md:row-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Analisis & Match Score</h3>
              <p className="text-slate-600 text-lg">
                Sistem kami mengaudit draf CV Anda, menemukan kata kunci yang hilang, dan memberikan Match Score sebelum Anda benar-benar mengirim lamaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full px-4 py-32 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-primary via-slate-800 to-brand-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Zap className="w-12 h-12 text-brand-tertiary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Siap untuk di-notice oleh HRD?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Berhenti menebak-nebak. Gunakan AI untuk mencocokkan CV Anda dan mulai dapatkan panggilan interview lebih banyak hari ini.
            </p>
            <Link href="/dashboard">
              <Button variant="primary" className="bg-brand-tertiary hover:bg-cyan-400 text-brand-primary font-bold px-10 py-5 text-xl h-auto shadow-lg hover:shadow-cyan-400/20 transition-all hover:-translate-y-1">
                Buat Akun Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
