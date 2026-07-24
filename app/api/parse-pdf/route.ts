import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser(null, 1 as any);

    return new Promise<NextResponse>((resolve) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error(errData.parserError);
        resolve(NextResponse.json({ error: 'Gagal membaca file PDF' }, { status: 500 }));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();
        resolve(NextResponse.json({ text }));
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Gagal membaca file PDF', details: error.message },
      { status: 500 }
    );
  }
}
