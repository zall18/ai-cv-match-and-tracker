# Product Requirements Document (PRD)
## AI CV-Match & Application Tracker

**Campaign Vibe Coding - Project Documentation**

### 1. Ringkasan Proyek (Overview)
Aplikasi web "AI CV-Match & Application Tracker" adalah platform terintegrasi untuk mengelola lamaran kerja dan mengoptimalkan Curriculum Vitae (CV) menggunakan kecerdasan buatan (AI). Aplikasi ini memungkinkan pengguna melacak proses rekrutmen dalam bentuk Kanban board sekaligus mengaudit draf CV mereka agar selaras dengan kualifikasi spesifik (Job Requirement) yang diminta oleh perekrut.

### 2. Tujuan & Nilai Tambah
*   **Tujuan:** Mencegah penggunaan CV generik untuk lowongan spesifik dan memberikan pemahaman instan mengenai area keahlian yang perlu ditonjolkan.
*   **Nilai Tambah:** Memiliki sistem AI yang bertindak sebagai "Auditor", memberikan persentase kecocokan (Match Score), menemukan kata kunci yang hilang (Missing Keywords), dan memberikan saran perbaikan yang dapat dieksekusi langsung.

### 3. User Persona
*   **Profil Utama:** Mahasiswa S1 (Sistem Informasi, Rekayasa Perangkat Lunak, dll.) atau *software engineer* pemula.
*   **Use Case Utama:** Melamar posisi teknis (seperti *Back-End Developer*, *Mobile Developer*), mencari tempat magang, atau mendaftar program bergengsi seperti Google Student Ambassador 2026.
*   **Kebutuhan:** Memastikan rekam jejak teknis, seperti proyek portofolio, pengalaman *developer*, penguasaan bahasa (TypeScript, Java, Kotlin, PHP), dan *framework* (Next.js, Express.js, Laravel), relevan dengan deskripsi pekerjaan yang dituju.

### 4. Spesifikasi Teknis (Tech Stack)
*   **Bahasa Pemrograman:** TypeScript (untuk keamanan tipe pada *form* dan integrasi AI).
*   **Frontend & API Routes:** Next.js dikombinasikan dengan Tailwind CSS. Next.js API Routes berfungsi sebagai *backend* untuk menyembunyikan API Key AI secara aman.
*   **Database & Autentikasi:** Supabase (Backend-as-a-Service berbasis PostgreSQL).
*   **AI Engine:** Google Gemini API atau OpenAI API untuk Natural Language Processing (NLP).
*   **Environment & OS:** Lingkungan pengembangan dikonfigurasi untuk Windows menggunakan Windows Subsystem for Linux (WSL).
*   **Deployment:** Cloudflare Pages/Workers atau Vercel.

### 5. Arsitektur & User Flow (Alur Pengguna)

#### A. Halaman Landing Page (Homepage)
*   **Hero Section:** Judul utama ("Lacak lamaranmu dan pastikan CV-mu tembus seleksi dengan AI") dan sub-judul.
*   **CTA Button:** Tombol "Mulai Optimasi Sekarang" yang mengarah ke Dashboard (memerlukan autentikasi Supabase).

#### B. Halaman Dashboard (Kanban Tracker)
*   **Fungsi:** Pusat kendali pelacakan lamaran.
*   **Struktur UI:** Kanban board dengan kolom:
    1.  *Wishlist* (Target perusahaan/program).
    2.  *Drafting CV* (Sedang dalam tahap penyesuaian/revisi CV).
    3.  *Applied* (Lamaran terkirim, misal: PT Telkom Indonesia, PT Chlorine, dll.).
    4.  *Interview* (Masuk tahap seleksi lanjutan).
*   **Aksi:** Tombol "+ Tambah Lamaran Baru (Analisis AI)" untuk membuka halaman fitur utama.

#### C. Halaman Fitur (AI CV Matcher)
*   **Input Data:** 
    *   Nama Posisi & Nama Perusahaan/Program.
    *   Teks *Job Requirement* (Area input kiri).
    *   Teks Draf CV pengguna (Area input kanan).
*   **Proses AI:** Saat tombol "Analisis Kecocokan" ditekan, API Route Next.js akan menyusun *prompt* rahasia berisi kedua teks dan mengirimkannya ke AI Engine.
*   **Output Data:**
    *   **Match Score:** Persentase kecocokan (0-100%).
    *   **Missing Keywords:** Label *skill* teknis yang dicari perekrut namun absen di CV (misal: "Prisma ORM", "Flutter").
    *   **Actionable Feedback:** Poin-poin saran konkret.
*   **Aksi Lanjutan:** Tombol "Simpan ke Tracker" (mengirim *payload* ke tabel Supabase dan menyimpan kartu ke dalam *board* Dashboard).

### 6. Rencana Pengembangan Lanjutan (Future Explorations)
*   **GitHub/Notion Integration:** Memungkinkan pengguna menarik (*pull*) data proyek portofolio langsung dari repositori GitHub atau basis data *tracker* produktivitas personal (seperti Notion) untuk secara otomatis merangkum pencapaian yang akan dimasukkan ke CV.