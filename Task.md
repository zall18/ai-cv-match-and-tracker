# Task List & Development Roadmap
## AI CV-Match & Application Tracker

Dokumen ini adalah daftar tugas (Task List) berurutan untuk mengembangkan aplikasi dari nol sampai live, sesuai dengan Tech Stack (Next.js, TypeScript, Supabase, Tailwind) dan panduan Vibe Coding.

### Phase 1: Setup & Initial Configuration (Langkah 0)
- [ ] Inisialisasi project Next.js dengan TypeScript, ESLint, dan Tailwind CSS (`npx create-next-app@latest`).
- [ ] Konfigurasi `tailwind.config.ts` menggunakan palet warna dan font dari `GuideStyle.md` (Primary, Secondary, Tertiary, Neutral, font Inter).
- [ ] Install library tambahan: 
  - `@supabase/supabase-js` (untuk database & auth)
  - `lucide-react` (untuk ikonografi yang sesuai dengan style guide)
  - `axios` atau *fetch wrapper* lainnya (untuk pemanggilan API).
- [ ] Setup file `.env.local` untuk menyimpan *environment variables*:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `AI_API_KEY` (Gemini atau OpenAI)

### Phase 2: Database & Backend-as-a-Service (Supabase) Setup
- [ ] Buat project baru di *dashboard* Supabase.
- [ ] Setup Supabase Authentication (Bisa gunakan Email/Password atau GitHub OAuth agar relevan untuk mahasiswa IT).
- [ ] Buat tabel `applications` di Supabase dengan skema (contoh):
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key ke tabel users)
  - `company_name` (text)
  - `role_name` (text)
  - `job_requirement` (text)
  - `cv_draft` (text)
  - `match_score` (integer)
  - `missing_keywords` (text array)
  - `feedback` (text array)
  - `status` (text: 'Wishlist', 'Drafting', 'Applied', 'Interview')
  - `created_at` (timestamp)
- [ ] Atur *Row Level Security* (RLS) di Supabase agar user hanya bisa membaca dan mengubah datanya sendiri.

### Phase 3: UI Components & Frontend Development
- [ ] **Komponen Global:**
  - Buat komponen `Button` dengan varian (Primary, Secondary, Inverted, Outlined).
  - Buat komponen `Input` dan `TextArea` dengan *styling* yang bersih (sudut rounded, border halus).
  - Buat komponen `Navigation Navbar/Pill` (untuk navigasi antar halaman).
- [ ] **Halaman Landing Page (Homepage):**
  - Buat struktur *Hero Section* (Judul, Sub-judul, Tombol "Mulai Optimasi").
- [ ] **Halaman Dashboard (Kanban Tracker):**
  - Buat *layout* 4 kolom (*Wishlist*, *Drafting CV*, *Applied*, *Interview*).
  - Buat komponen *Card* untuk menampilkan ringkasan lamaran (Nama perusahaan, posisi, dan *match score*).
- [ ] **Halaman Fitur Utama (AI Matcher):**
  - Buat form input atas (Posisi & Perusahaan).
  - Buat *Split View* (2 kolom besar) untuk input *Job Requirement* dan draf CV.
  - Buat komponen visualisasi hasil (*Circular Match Score*, tag/chip untuk *Missing Keywords*, dan list poin untuk *Feedback*).

### Phase 4: Core Logic & AI Integration
- [ ] Buat Next.js API Route (`/api/analyze-cv`).
- [ ] Rancang *System Prompt* khusus di dalam API Route untuk AI. Instruksikan AI agar mengembalikan balasan dalam format JSON terstruktur:
  ```json
  {
    "match_score": 85,
    "missing_keywords": ["TypeScript", "Supabase"],
    "actionable_feedback": ["Tambahkan pengalaman menggunakan TypeScript pada project X", "..."]
  }
  ```
- [ ] Implementasikan logika untuk mengirim input teks ke AI dan mengembalikan *response* ke *frontend*.

### Phase 5: State Management & Integration
- [ ] Hubungkan form AI Matcher di *frontend* dengan API `/api/analyze-cv`.
- [ ] Tampilkan animasi *loading state* saat menunggu respon dari AI.
- [ ] Buat fungsi untuk menyimpan hasil analisis dari halaman AI Matcher ke dalam database Supabase.
- [ ] Hubungkan Dashboard (Kanban Tracker) dengan Supabase untuk melakukan *Fetch* data.
- [ ] (Opsional) Tambahkan fitur *Drag and Drop* atau tombol *Dropdown* sederhana untuk memindahkan status lamaran antar kolom di Dashboard.

### Phase 6: Testing & Deployment
- [ ] Lakukan pengetesan menyeluruh (alur dari *Login* -> *Analisis CV* -> *Cek di Dashboard*).
- [ ] *Push code* ke repositori GitHub.
- [ ] *Deploy* aplikasi ke Vercel atau Cloudflare Pages (sesuai instruksi JDP Academy).
- [ ] Konfigurasi ulang *Environment Variables* di platform *deployment*.
- [ ] Lakukan tes final menggunakan URL publik.