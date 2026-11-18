import * as pdfjsLib from 'pdfjs-dist';

// Configure worker if in browser
if (typeof window !== 'undefined') {
  try {
    // In Chromium extension or browser, use unpkg / cdnjs or inline worker if local asset not mapped
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
  } catch {
    // Fallback gracefully
  }
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface PDFParseResult {
  numPages: number;
  fullText: string;
  pages: ExtractedPage[];
}

export async function parsePdfBuffer(buffer: ArrayBuffer): Promise<PDFParseResult> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: ExtractedPage[] = [];
  const textPieces: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageStrings = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((s: string) => s.trim().length > 0);

    const pageText = pageStrings.join(' ');
    pages.push({
      pageNumber: i,
      text: pageText,
    });
    textPieces.push(pageText);
  }

  return {
    numPages,
    fullText: textPieces.join('\n\n'),
    pages,
  };
}
