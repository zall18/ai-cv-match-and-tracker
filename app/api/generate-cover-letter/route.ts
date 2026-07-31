import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { jobRequirement, cvDraft, language, tone = 'professional' } = await req.json();

    if (!jobRequirement || !cvDraft) {
      return NextResponse.json(
        { error: 'jobRequirement and cvDraft are required' },
        { status: 400 }
      );
    }

    const langInstruction = language === 'id' 
      ? 'Tulis surat lamaran (Cover Letter) yang profesional, menarik, dan meyakinkan dalam BAHASA INDONESIA.'
      : 'Write a professional, engaging, and compelling Cover Letter in ENGLISH.';

    let toneInstruction = 'Gunakan tone yang percaya diri tapi tidak sombong (Professional & Formal).';
    if (tone === 'casual') {
      toneInstruction = 'Gunakan tone yang kreatif, bersahabat, namun tetap sopan (Creative & Friendly). Cocok untuk startup atau industri kreatif.';
    } else if (tone === 'direct') {
      toneInstruction = 'Gunakan tone yang langsung ke intinya (Direct & Concise), menonjolkan poin-poin utama tanpa basa-basi berlebihan.';
    }

    const SYSTEM_PROMPT = `
Anda adalah seorang ahli penulis karir (Career Coach & Copywriter) yang bertugas menulis Cover Letter kelas dunia.
Tugas Anda adalah membandingkan Job Requirement dan CV Draft kandidat, lalu menuliskan satu Cover Letter yang sempurna.
Aturan Penulisan:
1. ${langInstruction}
2. Fokus pada kekuatan kandidat yang relevan dengan Job Requirement.
3. Jangan pernah menyebutkan kekurangan atau missing keywords secara negatif. Ubah menjadi semangat untuk belajar jika relevan, atau abaikan.
4. ${toneInstruction}
5. Formatnya siap dikirim (bisa berupa struktur email atau surat formal). Termasuk placeholder seperti [Nama Anda] jika diperlukan.
6. HANYA kembalikan teks Cover Letter-nya saja, tanpa basa-basi atau perkenalan.
    `;

    const prompt = `Job Requirement:\n${jobRequirement}\n\nCV Draft:\n${cvDraft}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Sedikit lebih tinggi untuk kreativitas copywriting
      }
    });

    return NextResponse.json({ coverLetter: response.text || '' });

  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
