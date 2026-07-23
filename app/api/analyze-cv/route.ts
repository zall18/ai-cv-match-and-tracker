import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Anda adalah seorang AI CV Auditor yang bertugas mengaudit Curriculum Vitae (CV) terhadap Job Requirement tertentu.
Bandingkan Job Requirement dan CV Draft yang diberikan, lalu berikan analisis dalam format JSON murni TANPA ada teks sebelum atau sesudahnya.
Struktur JSON yang harus dikembalikan:
{
  "match_score": <number 0-100>,
  "missing_keywords": ["keyword1", "keyword2"],
  "actionable_feedback": ["Saran 1", "Saran 2"]
}
Aturan penilaian:
1. match_score harus berupa angka (0-100) berdasarkan seberapa relevan CV dengan Job Requirement.
2. missing_keywords adalah array of string berisi kemampuan/tools teknis yang ada di Job Requirement tapi TIDAK ada di CV.
3. actionable_feedback adalah array of string berisi saran perbaikan yang konkret (misal: "Tambahkan pengalaman menggunakan React.js di bagian proyek", dsb).

Kembalikan HANYA JSON. Jangan bungkus dengan markdown \`\`\`json.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobRequirement, cvDraft } = body;

    if (!jobRequirement || !cvDraft) {
      return NextResponse.json(
        { error: 'jobRequirement and cvDraft are required' },
        { status: 400 }
      );
    }

    const prompt = `Job Requirement:\n${jobRequirement}\n\nCV Draft:\n${cvDraft}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      }
    });

    const responseText = response.text || '';
    // Cleanup markdown json block if Gemini decides to include it despite instructions
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", cleanedText);
      return NextResponse.json({ error: 'AI returned invalid format' }, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
