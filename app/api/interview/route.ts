import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, jobRequirement, cvDraft, isFinished } = await req.json();

    if (!jobRequirement || !cvDraft) {
      return NextResponse.json(
        { error: 'jobRequirement and cvDraft are required' },
        { status: 400 }
      );
    }

    if (isFinished) {
      // Analyze the entire conversation and generate feedback
      const SYSTEM_PROMPT = `
Anda adalah seorang Senior HR Recruiter. Tugas Anda adalah mengevaluasi hasil simulasi wawancara kandidat berdasarkan Job Requirement dan CV Draft mereka.
Analisis seluruh riwayat percakapan (pertanyaan dan jawaban kandidat).
Berikan penilaian akhir secara objektif dan konstruktif.

KEMBALIKAN HANYA FORMAT JSON BERIKUT TANPA MARKDOWN ATAU TEKS LAINNYA:
{
  "score": <angka 0-100>,
  "strengths": ["kekuatan 1", "kekuatan 2"],
  "improvements": ["hal yang perlu diperbaiki 1", "hal yang perlu diperbaiki 2"],
  "advice": "saran keseluruhan untuk kandidat"
}
      `;

      const prompt = `Job Requirement:\n${jobRequirement}\n\nCV Draft:\n${cvDraft}\n\nRiwayat Percakapan Interview:\n${JSON.stringify(messages)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.2, 
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || '{}';
      const result = JSON.parse(resultText);

      return NextResponse.json(result);
    } else {
      // Generate the next question
      const SYSTEM_PROMPT = `
Anda adalah seorang HR Interviewer Profesional. Tugas Anda adalah mewawancarai kandidat berdasarkan Job Requirement dan CV Draft mereka.
Berikan SATU pertanyaan wawancara (dalam bahasa Indonesia yang profesional namun tidak kaku).
Pertanyaan harus spesifik, tajam, dan relevan dengan pengalaman kandidat di CV serta kebutuhan di Job Requirement.
Jika ini adalah pertanyaan pertama, perkenalkan diri Anda secara singkat sebagai pewawancara AI lalu ajukan pertanyaan pertama.
Jika ini adalah pertanyaan lanjutan, Anda boleh menanggapi jawaban kandidat sebelumnya secara singkat, lalu ajukan pertanyaan selanjutnya.
Jangan pernah memberikan feedback atau evaluasi panjang di tengah sesi.
Hanya kembalikan teks respons/pertanyaan Anda secara langsung tanpa embel-embel lain.
      `;

      const prompt = `Job Requirement:\n${jobRequirement}\n\nCV Draft:\n${cvDraft}\n\nRiwayat Percakapan (Pesan terakhir adalah dari kandidat, kecuali kosong):\n${JSON.stringify(messages)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      return NextResponse.json({ reply: response.text || '' });
    }

  } catch (error: any) {
    console.error('Error in AI Interview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
