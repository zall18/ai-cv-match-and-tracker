# UI/UX Style Guide
## AI CV-Match & Application Tracker

Dokumen ini berisi panduan gaya visual (Style Guide) yang diekstrak dari referensi desain utama. Panduan ini akan menjadi acuan dasar dalam pengaturan tema pada Tailwind CSS di dalam project Next.js.

### 1. Color Palette (Palet Warna)
Desain ini menggunakan skema warna yang profesional, modern, dan bernuansa teknologi (Slate & Cyan).

*   **Primary:** `#0F172A`
    *   *Penggunaan:* Warna utama untuk latar belakang gelap, teks utama pada latar terang, dan elemen hierarki tertinggi (seperti navbar atau header).
    *   *(Tailwind setara: slate-900)*
*   **Secondary:** `#64748B`
    *   *Penggunaan:* Warna teks sekunder, sub-judul, ikon pasif, dan elemen antarmuka pendukung.
    *   *(Tailwind setara: slate-500)*
*   **Tertiary / Accent:** `#06B6D4`
    *   *Penggunaan:* Warna aksen untuk elemen interaktif, sorotan utama, *progress bar*, atau indikator *match score* AI.
    *   *(Tailwind setara: cyan-500)*
*   **Neutral / Background:** `#F8FAFC`
    *   *Penggunaan:* Latar belakang utama aplikasi (kanvas), memberikan kontras yang lembut dan bersih dibandingkan warna putih solid.
    *   *(Tailwind setara: slate-50)*
*   **Semantic / Danger:** (Berdasarkan referensi ikon *delete* merah)
    *   *Penggunaan:* Aksi destruktif seperti menghapus data lamaran.

### 2. Typography (Tipografi)
Sistem menggunakan satu jenis *font* utama untuk menjaga konsistensi dan keterbacaan.

*   **Font Family Utama:** `Inter` (Sans-serif)
*   **Hierarki Tipografi:**
    *   **Headline:** Digunakan untuk judul halaman, skor AI besar, dan judul form. (Rekomendasi Tailwind: `text-2xl` hingga `text-4xl`, `font-bold`).
    *   **Body:** Digunakan untuk teks deskripsi, isi CV, syarat lowongan, dan detail kartu Kanban. (Rekomendasi Tailwind: `text-base`, `font-normal`).
    *   **Label:** Digunakan untuk label form, tag keahlian teknis (*chip*), dan teks tombol. (Rekomendasi Tailwind: `text-sm`, `font-medium` atau `font-semibold`).

### 3. UI Components (Komponen Antarmuka)

#### A. Buttons (Tombol)
Desain tombol memiliki sudut yang sedikit membulat (Rekomendasi Tailwind: `rounded-md` atau `rounded-lg`). Terdapat 4 varian utama:
1.  **Primary Button:** Latar belakang sangat gelap (`#0F172A` atau hitam), teks putih. Untuk aksi utama (CTA) seperti "Analisis Kecocokan".
2.  **Secondary Button:** Latar belakang abu-abu sangat terang/transparan, teks sekunder gelap. Untuk aksi alternatif.
3.  **Inverted Button:** Latar belakang abu-abu tua (`#64748B` atau serupa), teks putih. 
4.  **Outlined Button:** Tanpa latar belakang (transparan) dengan garis tepi (*border*) abu-abu, teks sekunder. Untuk aksi pembatalan atau aksi tersier.

#### B. Input Fields
*   **Search / Text Input:** Menggunakan latar belakang abu-abu sangat terang, garis tepi yang sangat halus (hampir tidak terlihat kecuali saat aktif), teks label di dalam (Rekomendasi: *placeholder* menggunakan warna `Secondary`), dan disertai ikon di sebelah kiri. Memiliki sudut *rounded*.

#### C. Iconography & Navigation
*   **Navigation Pill:** Desain navigasi menggunakan bentuk "pil" memanjang dengan latar abu-abu terang. Ikon yang sedang aktif (*Home*) memiliki latar belakang melingkar berwarna gelap (`#0F172A`) dengan ikon putih (*inverted*).
*   **Action Icons:** Ikon aksi spesifik ditempatkan di dalam lingkaran gelap (misal: ikon *magic wand* untuk fitur AI, ikon tag, atau ikon hapus dengan latar belakang lingkaran merah).

### 4. Rekomendasi Konfigurasi Tailwind (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0F172A',
          secondary: '#64748B',
          tertiary: '#06B6D4',
          neutral: '#F8FAFC',
        }
      }
    }
  }
}
```