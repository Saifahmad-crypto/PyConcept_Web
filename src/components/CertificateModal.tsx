import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, X, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { TopicId } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: TopicId;
  topicTitle: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  topicId,
  topicTitle,
}) => {
  const [recipientName, setRecipientName] = useState(() => {
    try {
      return localStorage.getItem('pyverse-cert-name') || 'Python Learner';
    } catch {
      return 'Python Learner';
    }
  });

  const [issueDate, setIssueDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleNameChange = (name: string) => {
    setRecipientName(name);
    try {
      localStorage.setItem('pyverse-cert-name', name);
    } catch {
      // ignore storage failure
    }
  };

  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1600;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // 1. Background - Deep Luxury Black/Ruby Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0202');
    bgGrad.addColorStop(0.5, '#120404');
    bgGrad.addColorStop(1, '#080101');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow behind center
    const radial = ctx.createRadialGradient(width / 2, height * 0.45, 50, width / 2, height * 0.45, 600);
    radial.addColorStop(0, 'rgba(225, 9, 6, 0.12)');
    radial.addColorStop(0.6, 'rgba(225, 9, 6, 0.03)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // Fine grid overlay
    ctx.strokeStyle = 'rgba(251, 245, 249, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Borders & Ornamental Frame
    // Outer border
    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Inner gold/crimson border
    const borderGrad = ctx.createLinearGradient(0, 0, width, height);
    borderGrad.addColorStop(0, '#E10906');
    borderGrad.addColorStop(0.5, '#E5DFDF');
    borderGrad.addColorStop(1, '#E10906');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Inner dotted frame
    ctx.save();
    ctx.strokeStyle = 'rgba(225, 9, 6, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(60, 60, width - 120, height - 120);
    ctx.restore();

    // Corner decorative brackets
    const cornerSize = 40;
    const corners = [
      { x: 48, y: 48, dx: 1, dy: 1 },
      { x: width - 48, y: 48, dx: -1, dy: 1 },
      { x: 48, y: height - 48, dx: 1, dy: -1 },
      { x: width - 48, y: height - 48, dx: -1, dy: -1 },
    ];
    corners.forEach(({ x, y, dx, dy }) => {
      ctx.strokeStyle = '#E10906';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y + dy * cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * cornerSize, y);
      ctx.stroke();

      // Mini corner square
      ctx.fillStyle = '#E10906';
      ctx.fillRect(x + dx * 8 - (dx < 0 ? 6 : 0), y + dy * 8 - (dy < 0 ? 6 : 0), 6, 6);
    });

    // 3. PyVerse Logo Header
    ctx.save();
    const logoX = width / 2 - 130;
    const logoY = 105;
    const logoScale = 0.95;

    ctx.translate(logoX, logoY);
    ctx.scale(logoScale, logoScale);

    // Logo icon background
    ctx.fillStyle = '#100303';
    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Rounded rect
    const r = 12;
    const rx = 4, ry = 4, rw = 56, rh = 56;
    if ('roundRect' in ctx && typeof (ctx as unknown as { roundRect?: Function }).roundRect === 'function') {
      (ctx as unknown as { roundRect: Function }).roundRect(rx, ry, rw, rh, r);
    } else {
      ctx.rect(rx, ry, rw, rh);
    }
    ctx.fill();
    ctx.stroke();

    // Outer P path (white)
    ctx.strokeStyle = '#FBF5F9';
    ctx.lineWidth = 5;
    ctx.lineCap = 'square';
    try {
      const p1 = new Path2D('M16 48 L16 18 C16 14, 19 12, 23 12 L38 12 C45.5 12, 50 17, 50 24.5 C50 32, 45.5 37, 38 37 L26 37');
      ctx.stroke(p1);
    } catch {
      // fallback line
      ctx.strokeRect(16, 18, 22, 19);
    }

    // Inner red vector
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'square';
    try {
      const p2 = new Path2D('M26 50 L26 24 L37 24 C40 24, 42 25.8, 42 28.5 C42 31.2, 40 33, 37 33 L26 33');
      ctx.stroke(p2);
    } catch {
      ctx.strokeRect(26, 24, 11, 9);
    }

    ctx.fillStyle = '#E10906';
    ctx.fillRect(40, 42, 10, 8);
    ctx.restore();

    // Wordmark next to icon: PyVerse
    ctx.font = '800 38px "Space Grotesk", system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FBF5F9';
    ctx.fillText('Py', width / 2 - 60, 134);
    const pyWidth = ctx.measureText('Py').width;
    ctx.fillStyle = '#E10906';
    ctx.fillText('Verse', width / 2 - 60 + pyWidth, 134);

    // Tagline
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '5px';
    } catch {
      // ignore
    }
    ctx.fillStyle = '#8A8585';
    ctx.fillText('THINK · CODE · EXPERIMENT', width / 2, 185);

    // 4. Certificate Title
    ctx.font = '800 44px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FBF5F9';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF MASTERY', width / 2, 260);

    // Subtitle
    ctx.font = '500 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#8A8585';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '2px';
    } catch {
      // ignore
    }
    ctx.fillText('THIS RECOGNITION IS PROUDLY CONFERRED UPON', width / 2, 315);

    // 5. Recipient Name
    const cleanName = (recipientName || 'Python Learner').trim();
    ctx.font = '700 58px "Cinzel", "Playfair Display", Georgia, serif';
    const nameGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
    nameGrad.addColorStop(0, '#FFFFFF');
    nameGrad.addColorStop(0.5, '#FFF2F2');
    nameGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = nameGrad;
    ctx.fillText(cleanName, width / 2, 395);

    // Elegant underline for name
    const nameWidth = Math.max(340, ctx.measureText(cleanName).width + 60);
    const lineY = 425;
    const underlineGrad = ctx.createLinearGradient(width / 2 - nameWidth / 2, 0, width / 2 + nameWidth / 2, 0);
    underlineGrad.addColorStop(0, 'rgba(225, 9, 6, 0)');
    underlineGrad.addColorStop(0.5, '#E10906');
    underlineGrad.addColorStop(1, 'rgba(225, 9, 6, 0)');
    ctx.strokeStyle = underlineGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - nameWidth / 2, lineY);
    ctx.lineTo(width / 2 + nameWidth / 2, lineY);
    ctx.stroke();

    // Center jewel on line
    ctx.fillStyle = '#E10906';
    ctx.beginPath();
    ctx.arc(width / 2, lineY, 4, 0, Math.PI * 2);
    ctx.fill();

    // 6. Topic Certification Statement
    ctx.font = '400 19px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#CFC8C8';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '0px';
    } catch {
      // ignore
    }
    ctx.fillText('for successfully completing all interactive lessons, visual flow simulations, and challenge missions in', width / 2, 475);

    // Topic Name Highlight Box
    ctx.font = '800 40px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#E10906';
    ctx.fillText(topicTitle.toUpperCase(), width / 2, 535);

    ctx.font = '400 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#9A8585';
    ctx.fillText('100% Curriculum Completed · Interactive Python Visualizer Verified', width / 2, 580);

    // 7. Footer: Date, Seal, and Signature
    const footerY = 740;

    // Left: Date
    ctx.textAlign = 'center';
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A8585';
    ctx.fillText('DATE OF ISSUANCE', 280, footerY);
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FBF5F9';
    ctx.fillText(issueDate, 280, footerY + 34);

    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(170, footerY + 46);
    ctx.lineTo(390, footerY + 46);
    ctx.stroke();

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6E6767';
    ctx.fillText('VERIFIED VIA LOCAL STORAGE ID', 280, footerY + 66);

    // Center: Official PyVerse Seal Badge
    const sealX = width / 2;
    const sealY = footerY + 20;

    // Outer seal circle
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dashed circle
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 245, 249, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Seal fill
    ctx.fillStyle = '#190909';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
    ctx.fill();

    // Star / Seal core
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#E10906';
    ctx.fillText('★', sealX, sealY - 4);
    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FBF5F9';
    ctx.fillText('VERIFIED', sealX, sealY + 16);

    // Seal outer curved text or label
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A8585';
    ctx.fillText('PYVERSE ACADEMIC SEAL', sealX, sealY + 76);

    // Right: Signature
    const sigX = width - 280;
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A8585';
    ctx.fillText('DIRECTOR OF CURRICULUM', sigX, footerY);

    // Stylized signature
    ctx.font = 'italic 700 26px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FBF5F9';
    ctx.fillText('PyVerse Council', sigX, footerY + 30);

    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigX - 110, footerY + 46);
    ctx.lineTo(sigX + 110, footerY + 46);
    ctx.stroke();

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6E6767';
    ctx.fillText(`PV-${topicId.toUpperCase()}-${Math.abs(cleanName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 90000 + 10000)}`, sigX, footerY + 66);

    // Reset settings
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '0px';
    } catch {
      // ignore
    }
  }, [recipientName, issueDate, topicId, topicTitle]);

  useEffect(() => {
    if (isOpen) {
      // Allow modal DOM to mount canvas before drawing
      const timer = setTimeout(() => {
        drawCertificate();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, drawCertificate]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const safeName = (recipientName || 'Learner').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `PyVerse_Certificate_${topicId}_${safeName}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Failed to export certificate image:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#3A1D1D] bg-[#100303] text-[#FBF5F9] shadow-2xl p-5 sm:p-7 space-y-5 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2C1616] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#190909] border border-[#3A1D1D] text-[#E10906]">
              <Award className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Certificate of Mastery
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </h2>
              <p className="text-xs text-[#8A8585]">
                {topicTitle} · Official PyVerse Completion Award
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8A8585] hover:text-white hover:bg-[#190909] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10906]"
            aria-label="Close certificate dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Name & Date Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#190909] border border-[#2C1616] rounded-xl p-4">
          <div>
            <label htmlFor="cert-name" className="block text-xs font-medium text-[#CFC8C8] mb-1.5">
              Enter your Name (Certificate par aayega):
            </label>
            <input
              id="cert-name"
              type="text"
              value={recipientName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. John Doe / Priya Sharma"
              maxLength={40}
              className="w-full rounded-lg border border-[#3A1D1D] bg-[#100303] px-3 py-2 text-sm text-white placeholder-[#6E6767] focus:border-[#E10906] focus:outline-none focus:ring-1 focus:ring-[#E10906]"
            />
          </div>

          <div>
            <label htmlFor="cert-date" className="block text-xs font-medium text-[#CFC8C8] mb-1.5">
              Completion Date:
            </label>
            <input
              id="cert-date"
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="e.g. November 26, 2026"
              className="w-full rounded-lg border border-[#3A1D1D] bg-[#100303] px-3 py-2 text-sm text-white placeholder-[#6E6767] focus:border-[#E10906] focus:outline-none focus:ring-1 focus:ring-[#E10906]"
            />
          </div>
        </div>

        {/* Live Canvas Certificate Preview */}
        <div className="relative rounded-xl border border-[#2C1616] bg-black p-2 sm:p-3 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[460px] object-contain rounded-lg shadow-lg border border-[#2A1010]"
            style={{ aspectRatio: '16 / 10' }}
          />
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#8A8585] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#E10906]" />
            High-resolution 1600×1000 PNG format ready for download &amp; sharing.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-[#3A1D1D] bg-[#190909] px-4 py-2.5 text-xs font-semibold text-[#CFC8C8] hover:text-white hover:border-[#E10906] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#E10906] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#C40705] transition-colors shadow-md hover:shadow-red-900/40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Certificate (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
