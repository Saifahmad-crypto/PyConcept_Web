// Pure TypeScript A4 Landscape PDF generator from Canvas (Zero External Dependencies)

export async function downloadCanvasAsA4LandscapePdf(
  canvas: HTMLCanvasElement,
  filename: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 1. Get JPEG binary bytes from canvas
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const base64Index = dataUrl.indexOf(',');
    if (base64Index === -1) {
      reject(new Error('Failed to encode canvas as JPEG'));
      return;
    }
    const base64Data = dataUrl.substring(base64Index + 1);
    const binaryStr = atob(base64Data);
    const jpegBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      jpegBytes[i] = binaryStr.charCodeAt(i);
    }

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // A4 Landscape dimensions in PDF standard points (72 pt / inch)
    // 297mm x 210mm = 841.89 pt x 595.28 pt
    const pageWidth = 841.89;
    const pageHeight = 595.28;

    // 2. Assemble PDF Objects
    const parts: (string | Uint8Array)[] = [];
    const offsets: number[] = [];
    let currentOffset = 0;

    function addPart(content: string | Uint8Array) {
      parts.push(content);
      currentOffset += typeof content === 'string' ? new TextEncoder().encode(content).length : content.length;
    }

    // PDF Header
    addPart('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    // Obj 1: Catalog
    offsets.push(currentOffset);
    addPart('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    // Obj 2: Pages tree
    offsets.push(currentOffset);
    addPart('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    // Obj 3: Page object
    offsets.push(currentOffset);
    addPart(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /ProcSet [/PDF /ImageC] /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
    );

    // Obj 4: Image XObject (JPEG)
    offsets.push(currentOffset);
    addPart(
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    );
    addPart(jpegBytes);
    addPart('\nendstream\nendobj\n');

    // Obj 5: Page Content stream
    // Transform matrix: scale image to fit entire A4 landscape page: [width 0 0 height 0 0] cm
    const contentStream = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`;
    const streamLen = new TextEncoder().encode(contentStream).length;

    offsets.push(currentOffset);
    addPart(`5 0 obj\n<< /Length ${streamLen} >>\nstream\n${contentStream}endstream\nendobj\n`);

    // XRef Table
    const startXRef = currentOffset;
    addPart('xref\n0 6\n0000000000 65535 f \n');
    for (const off of offsets) {
      addPart(off.toString().padStart(10, '0') + ' 00000 n \n');
    }

    // Trailer
    addPart(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXRef}\n%%EOF\n`);

    // 3. Create Blob and trigger download
    try {
      const blob = new Blob(parts, { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
