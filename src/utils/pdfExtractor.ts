import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker from cdnjs or unpkg so it runs client-side without bundler worker issues
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ExtractedPage {
  pageNumber: number;
  dataUrl: string;
}

/**
 * Extracts each page of an uploaded PDF file as a high-resolution JPEG Data URL
 */
export async function extractPhotosFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@legacy/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results: ExtractedPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    // Render at 2x scale for sharp, high-DPI quality photos
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    results.push({
      pageNumber: i,
      dataUrl,
    });

    if (onProgress) {
      onProgress(i, numPages);
    }
  }

  return results;
}
