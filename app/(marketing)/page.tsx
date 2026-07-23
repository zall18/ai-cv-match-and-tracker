import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wand2, LayoutDashboard, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tertiary/10 text-brand-tertiary text-sm font-medium mb-8">
        <Wand2 className="w-4 h-4" />
        <span>Dioptimalkan oleh AI</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-brand-primary mb-6 tracking-tight">
        Lacak lamaranmu dan pastikan CV-mu tembus seleksi dengan AI
      </h1>

      <p className="text-lg md:text-xl text-brand-secondary mb-10 max-w-2xl mx-auto">
        Platform terintegrasi untuk mengelola lamaran kerja dan mengaudit draf CV kamu agar 100% selaras dengan Job Requirement menggunakan kecerdasan buatan.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard">
          <Button variant="primary" className="w-full sm:w-auto px-8 py-3 text-lg h-auto">
            Mulai Optimasi Sekarang
          </Button>
        </Link>
        <a href="#features">
          <Button variant="secondary" className="w-full sm:w-auto px-8 py-3 text-lg h-auto">
            Pelajari Fitur
          </Button>
        </a>
      </div>

      {/* Spacer */}
      <div className="py-16"></div>

      {/* Features Section */}
      <div id="features" className="w-full text-left pt-20">
        <h2 className="text-3xl font-bold text-brand-primary mb-2 text-center">Fitur Unggulan</h2>
        <p className="text-brand-secondary text-center mb-12">Semua yang Anda butuhkan untuk melamar kerja lebih efektif.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-2">Kanban Tracker</h3>
            <p className="text-brand-secondary">Kelola status lamaran kerjamu dari Wishlist hingga tahap Interview dengan mudah.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-brand-tertiary/10 rounded-xl flex items-center justify-center text-brand-tertiary mb-4">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-2">AI CV Auditor</h3>
            <p className="text-brand-secondary">Dapatkan Match Score, Missing Keywords, dan feedback langsung dari AI untuk CV kamu.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-2">Anti CV Generik</h3>
            <p className="text-brand-secondary">Sesuaikan setiap lamaran dengan Job Requirement spesifik untuk meningkatkan peluang lulus.</p>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="w-full text-left pt-32 pb-16">
        <div className="bg-slate-100 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-brand-primary mb-6">Tentang Aplikasi Ini</h2>
          <p className="text-brand-secondary text-lg leading-relaxed mb-6">
            <strong>CV Matcher</strong> dibangun khusus untuk para talenta muda (mahasiswa, junior engineer) yang sering kali mengirimkan CV *generik* yang sama ke puluhan loker berbeda.
          </p>
          <p className="text-brand-secondary text-lg leading-relaxed">
            Dengan bantuan teknologi AI (Google Gemini), aplikasi ini bertindak sebagai auditor pribadi Anda. Aplikasi tidak hanya memberikan &quot;Match Score&quot;, tetapi mengekstraksi kata kunci yang hilang dan memberi saran konkrit tentang bagaimana agar CV Anda bisa lebih menonjol di mata perekrut atau sistem ATS (Applicant Tracking System).
          </p>
        </div>
      </div>
    </div>
  );
}
