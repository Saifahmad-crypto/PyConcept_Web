import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Download, X, Award, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';
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

  const [certTheme, setCertTheme] = useState<'dark' | 'light'>('dark');

  // Stable random certificate ID per topic/session
  const certId = useMemo(() => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `PV-2026-${digits}`;
  }, [topicId]);

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

    const isLight = certTheme === 'light';

    // 1. Background
    if (isLight) {
      // Light print-friendly luxury parchment
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#FCFBF8');
      bgGrad.addColorStop(0.5, '#F7F4EE');
      bgGrad.addColorStop(1, '#EFEAE0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm radial
      const radial = ctx.createRadialGradient(width / 2, height * 0.44, 40, width / 2, height * 0.44, 550);
      radial.addColorStop(0, 'rgba(225, 9, 6, 0.05)');
      radial.addColorStop(0.7, 'rgba(225, 9, 6, 0.01)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Fine grid
      ctx.strokeStyle = 'rgba(16, 3, 3, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else {
      // Deep luxury dark gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0202');
      bgGrad.addColorStop(0.5, '#120404');
      bgGrad.addColorStop(1, '#080101');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle radial glow
      const radial = ctx.createRadialGradient(width / 2, height * 0.44, 50, width / 2, height * 0.44, 600);
      radial.addColorStop(0, 'rgba(225, 9, 6, 0.14)');
      radial.addColorStop(0.6, 'rgba(225, 9, 6, 0.03)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Fine grid
      ctx.strokeStyle = 'rgba(251, 245, 249, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 2. Borders & Ornamental Corners
    ctx.strokeStyle = isLight ? '#2A1010' : '#3A1D1D';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    const borderGrad = ctx.createLinearGradient(0, 0, width, height);
    borderGrad.addColorStop(0, '#E10906');
    borderGrad.addColorStop(0.5, isLight ? '#8A7550' : '#FBF5F9');
    borderGrad.addColorStop(1, '#E10906');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(225, 9, 6, 0.45)' : 'rgba(225, 9, 6, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(60, 60, width - 120, height - 120);
    ctx.restore();

    // Corner decorative brackets
    const cornerSize = 42;
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

      ctx.fillStyle = '#E10906';
      ctx.fillRect(x + dx * 8 - (dx < 0 ? 6 : 0), y + dy * 8 - (dy < 0 ? 6 : 0), 6, 6);
    });

    // 3. PyVerse Logo Header (adjusted y-axis to reduce gap)
    ctx.save();
    const logoX = width / 2 - 130;
    const logoY = 92;
    const logoScale = 0.95;

    ctx.translate(logoX, logoY);
    ctx.scale(logoScale, logoScale);

    ctx.fillStyle = '#100303';
    ctx.strokeStyle = isLight ? '#2A1010' : '#3A1D1D';
    ctx.lineWidth = 2;
    ctx.beginPath();
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
      ctx.strokeRect(16, 18, 22, 19);
    }

    // Inner red logic vector
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

    // Wordmark
    ctx.font = '800 38px "Space Grotesk", system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isLight ? '#100303' : '#FBF5F9';
    ctx.fillText('Py', width / 2 - 60, 121);
    const pyWidth = ctx.measureText('Py').width;
    ctx.fillStyle = '#E10906';
    ctx.fillText('Verse', width / 2 - 60 + pyWidth, 121);

    // Tagline - larger & brighter
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '5px';
    } catch {}
    ctx.fillStyle = isLight ? '#4A3D3D' : '#E5DFDF';
    ctx.fillText('THINK · CODE · EXPERIMENT', width / 2, 168);

    // 4. Certificate Title: "Certificate of Completion"
    ctx.font = '800 46px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillStyle = isLight ? '#100303' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 240);

    // Subtitle - brighter & larger
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = isLight ? '#4A3D3D' : '#E5DFDF';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '3px';
    } catch {}
    ctx.fillText('THIS RECOGNITION IS PROUDLY CONFERRED UPON', width / 2, 292);

    // 5. Recipient Name
    const cleanName = (recipientName || 'Python Learner').trim();
    ctx.font = '700 62px "Cinzel", "Playfair Display", Georgia, serif';
    if (isLight) {
      ctx.fillStyle = '#100303';
    } else {
      const nameGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
      nameGrad.addColorStop(0, '#FFFFFF');
      nameGrad.addColorStop(0.5, '#FFF2F2');
      nameGrad.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = nameGrad;
    }
    ctx.fillText(cleanName, width / 2, 375);

    // Underline
    const nameWidth = Math.max(360, ctx.measureText(cleanName).width + 60);
    const lineY = 405;
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

    ctx.fillStyle = '#E10906';
    ctx.beginPath();
    ctx.arc(width / 2, lineY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Topic Certification Statement - larger & brighter
    ctx.font = '500 20px "Space Grotesk", sans-serif';
    ctx.fillStyle = isLight ? '#382D2D' : '#F1EEEE';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '0px';
    } catch {}
    ctx.fillText('for successfully completing all interactive lessons, visual flow simulations, and challenge missions in', width / 2, 458);

    // Topic Name Highlight Box
    ctx.font = '800 42px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#E10906';
    ctx.fillText(topicTitle.toUpperCase(), width / 2, 518);

    // Curriculum verification label - brighter & larger
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#554848' : '#D1C7C7';
    ctx.fillText('100% Curriculum Completed · Interactive Python Visualizer Verified', width / 2, 562);

    // 7. Footer: Date, Seal, and Signature (compacted gap: footerY moved from 740 to 660)
    const footerY = 660;

    // Left: Date
    ctx.textAlign = 'center';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#554848' : '#D1C7C7';
    ctx.fillText('DATE OF ISSUANCE', 280, footerY);

    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillStyle = isLight ? '#100303' : '#FBF5F9';
    ctx.fillText(issueDate, 280, footerY + 36);

    ctx.strokeStyle = isLight ? '#CFC8C8' : '#3A1D1D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(170, footerY + 50);
    ctx.lineTo(390, footerY + 50);
    ctx.stroke();

    // Random Certificate ID shown on left (replaced "local storage ID")
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E10906';
    ctx.fillText(`ID: ${certId}`, 280, footerY + 74);

    // Center: Official PyVerse Seal Badge with "COMPLETED"
    const sealX = width / 2;
    const sealY = footerY + 28;

    // Outer seal circle
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dashed circle
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(16, 3, 3, 0.4)' : 'rgba(251, 245, 249, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Seal fill
    ctx.fillStyle = isLight ? '#F5EBEB' : '#190909';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI * 2);
    ctx.fill();

    // Star / Seal core
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#E10906';
    ctx.fillText('★', sealX, sealY - 4);

    // Seal text: "COMPLETED" (per user request)
    ctx.font = '800 11px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#100303' : '#FBF5F9';
    ctx.fillText('COMPLETED', sealX, sealY + 16);

    // Seal outer curved text or label
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#554848' : '#D1C7C7';
    ctx.fillText('PYVERSE ACADEMIC SEAL', sealX, sealY + 76);

    // Right: Signature
    const sigX = width - 280;
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#554848' : '#D1C7C7';
    ctx.fillText('DIRECTOR OF CURRICULUM', sigX, footerY);

    // Stylized signature
    ctx.font = 'italic 700 28px "Playfair Display", Georgia, serif';
    ctx.fillStyle = isLight ? '#100303' : '#FBF5F9';
    ctx.fillText('PyVerse Council', sigX, footerY + 32);

    ctx.strokeStyle = isLight ? '#CFC8C8' : '#3A1D1D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigX - 110, footerY + 50);
    ctx.lineTo(sigX + 110, footerY + 50);
    ctx.stroke();

    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? '#382D2D' : '#E5DFDF';
    ctx.fillText('VERIFIED CREDENTIAL', sigX, footerY + 74);

    // Reset settings
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '0px';
    } catch {}
  }, [recipientName, issueDate, topicId, topicTitle, certTheme, certId]);

  useEffect(() => {
    if (isOpen) {
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
      const themeSuffix = certTheme === 'light' ? '_Print' : '';
      a.download = `PyVerse_Certificate_${topicId}_${safeName}${themeSuffix}.png`;
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
                Certificate of Completion
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </h2>
              <p className="text-xs text-[#8A8585]">
                {topicTitle} · {certId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle (Dark vs Light Print) */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-[#3A1D1D] bg-[#190909] p-1">
              <button
                type="button"
                onClick={() => setCertTheme('dark')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  certTheme === 'dark'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] hover:text-white'
                }`}
                title="Dark Luxury Theme"
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setCertTheme('light')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  certTheme === 'light'
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] hover:text-white'
                }`}
                title="Print-Friendly Light Theme (Saves Ink)"
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light (print)</span>
              </button>
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
            High-resolution 1600×1000 PNG format · {certTheme === 'light' ? 'Light Print Edition' : 'Dark Luxury Edition'}
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
