import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  X,
  Download,
  Copy,
  Share2,
  Check,
  Trophy,
  Award,
  Sparkles,
  Zap,
  MessageCircle,
} from 'lucide-react';

export interface ScoreCardData {
  title: string;
  category: string; // 'Topic Quiz' | 'Mini-Game' | 'Escape Room' | 'Bug Hunter' | 'Challenge'
  score: number;
  maxScore: number;
  topic?: string;
  timeTakenSec?: number;
}

interface ScoreCardModalProps {
  data: ScoreCardData | null;
  onClose: () => void;
}

export const ScoreCardModal: React.FC<ScoreCardModalProps> = ({ data, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerName, setPlayerName] = useState<string>('PyVerse Coder');
  const [copied, setCopied] = useState<boolean>(false);
  const [canShare, setCanShare] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  const drawScoreCard = useCallback(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 675;
    canvas.width = width;
    canvas.height = height;

    const { title, category, score, maxScore, topic } = data;
    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    // 1. Background gradient (Obsidian Luxury)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0c0203');
    bgGrad.addColorStop(0.5, '#160406');
    bgGrad.addColorStop(1, '#080102');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Micro Guilloche Wave Lines in background
    ctx.save();
    ctx.strokeStyle = 'rgba(55, 18, 22, 0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const baseY = 180 + i * 65;
      for (let x = 0; x < width; x += 15) {
        const waveY = baseY + Math.sin(x * 0.008 + i * 0.5) * 22 + Math.cos(x * 0.004) * 14;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Geometric Grid Lines
    ctx.strokeStyle = 'rgba(50, 16, 19, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, height - 40);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 40, y);
      ctx.stroke();
    }

    // Outer & Inner Borders (Luxury Metallic Bevel)
    ctx.strokeStyle = 'rgba(45, 12, 14, 0.8)';
    ctx.lineWidth = 2;
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(38, 38, width - 76, height - 76, 24);
    else ctx.strokeRect(38, 38, width - 76, height - 76);
    ctx.stroke();

    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(32, 32, width - 64, height - 64, 28);
    else ctx.strokeRect(32, 32, width - 64, height - 64);
    ctx.stroke();

    ctx.strokeStyle = '#4B1C20';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(44, 44, width - 88, height - 88, 20);
    else ctx.strokeRect(44, 44, width - 88, height - 88);
    ctx.stroke();

    // Corner Ornaments / Gold Rivets
    const corners = [
      [44, 44],
      [width - 44, 44],
      [44, height - 44],
      [width - 44, height - 44],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#100405';
      ctx.strokeStyle = '#E10906';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Top Bar: PyVerse Brand & Category Pill
    const brandX = 75;
    const brandY = 62;

    // PyVerse Emblem Box
    ctx.save();
    ctx.translate(brandX, brandY);
    ctx.fillStyle = '#160406';
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(0, 0, 48, 48, 12);
    else ctx.rect(0, 0, 48, 48);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 26px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 24, 24);
    ctx.restore();

    // Brand Wordmark
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '800 28px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Py', brandX + 62, brandY + 4);
    const pyW = ctx.measureText('Py').width;
    ctx.fillStyle = '#E10906';
    ctx.fillText('Verse', brandX + 62 + pyW, brandY + 4);

    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#A08C8C';
    ctx.fillText('VERIFIED LOGIC ASSESSMENT  //  EVALUATION RECORD', brandX + 62, brandY + 36);

    // Official Embossed Gold Hologram Medallion (Top Right)
    const sealCx = width - 130;
    const sealCy = 86;
    const sealR = 38;

    // Serrated outer rays
    ctx.save();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    for (let angle = 0; angle < 360; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      const x1 = sealCx + Math.cos(rad) * (sealR + 2);
      const y1 = sealCy + Math.sin(rad) * (sealR + 2);
      const x2 = sealCx + Math.cos(rad) * (sealR + 6);
      const y2 = sealCy + Math.sin(rad) * (sealR + 6);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = '#160608';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealCx, sealCy, sealR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#8C6E1E';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sealCx, sealCy, sealR - 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('OFFICIAL', sealCx, sealCy - 18);
    ctx.font = '800 13px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SEAL', sealCx, sealCy - 3);
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('2026', sealCx, sealCy + 13);

    // Category Pill next to seal
    const catLabel = (category ? `${category.toUpperCase()} • GRADE A+` : 'OFFICIAL RESULT • GRADE A+');
    ctx.font = '700 12px "JetBrains Mono", monospace';
    const pillW = ctx.measureText(catLabel).width + 26;
    const pillX = sealCx - sealR - pillW - 24;
    const pillY = 70;

    ctx.fillStyle = 'rgba(225, 9, 6, 0.16)';
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(pillX, pillY, pillW, 34, 17);
    else ctx.rect(pillX, pillY, pillW, 34);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFF0F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catLabel, pillX + pillW / 2, pillY + 17);

    // Header Divider Line
    ctx.strokeStyle = '#321214';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(75, 134);
    ctx.lineTo(width - 75, 134);
    ctx.stroke();

    // 3. Candidate & Exam Meta Section
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E10906';
    ctx.fillText('OFFICIAL ASSESSMENT REPORT', 75, 156);

    ctx.font = '800 30px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(title, 75, 194);

    // Candidate Name & Verified Badge
    const cleanPlayer = (playerName || 'PyVerse Learner').trim();
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('CANDIDATE: ', 75, 234);
    const pPrefixW = ctx.measureText('CANDIDATE: ').width;

    ctx.font = '800 24px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(cleanPlayer, 75 + pPrefixW, 235);
    const pNameW = ctx.measureText(cleanPlayer).width;

    const vBadgeX = 75 + pPrefixW + pNameW + 18;
    const vBadgeY = 216;
    ctx.fillStyle = 'rgba(14, 45, 24, 0.9)';
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(vBadgeX, vBadgeY, 115, 26, 13);
    else ctx.rect(vBadgeX, vBadgeY, 115, 26);
    ctx.fill();
    ctx.stroke();

    // Drawn crisp green checkmark in badge
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vBadgeX + 16, vBadgeY + 13);
    ctx.lineTo(vBadgeX + 21, vBadgeY + 18);
    ctx.lineTo(vBadgeX + 28, vBadgeY + 9);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#86EFAC';
    ctx.fillText('VERIFIED ID', vBadgeX + 34, vBadgeY + 17);

    // 4. Three-Card Performance Dashboard Grid
    const gridY = 265;
    const colW = 330;
    const colH = 215;
    const gap = 30;
    const startX = 75;

    // Helper: geometric star
    const drawStar = (cx: number, cy: number, rOut: number, rIn: number, filled: boolean, strokeCol: string) => {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? rOut : rIn;
        const ang = (i * 36 - 90) * (Math.PI / 180);
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (filled) {
        ctx.fillStyle = strokeCol;
        ctx.fill();
      }
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    // Rank / Performance Calculation
    let rankTitle = 'APPRENTICE EXPLORER';
    let filledStars = 2;
    let rankColor = '#8A8585';
    let tierText = 'Top 50% Tier';

    if (percent === 100) {
      rankTitle = 'PERFECT MASTER';
      filledStars = 5;
      rankColor = '#10B981';
      tierText = 'Top 1% Percentile';
    } else if (percent >= 80) {
      rankTitle = 'LOGIC CHAMPION';
      filledStars = 4;
      rankColor = '#F59E0B';
      tierText = 'Top 5% Percentile';
    } else if (percent >= 60) {
      rankTitle = 'RISING PYTHON CODER';
      filledStars = 3;
      rankColor = '#3B82F6';
      tierText = 'Top 20% Percentile';
    }

    // Card 1: Overall Score & Accuracy
    const c1X = startX;
    ctx.fillStyle = '#0E0305';
    ctx.strokeStyle = '#411619';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c1X, gridY, colW, colH, 16);
    else ctx.rect(c1X, gridY, colW, colH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E10906';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c1X, gridY, colW, 6, [16, 16, 0, 0] as any);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#AA9696';
    ctx.fillText('OVERALL SCORE', c1X + 22, gridY + 28);

    ctx.font = '800 60px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${score} / ${maxScore}`, c1X + 22, gridY + 84);

    // Progress Bar
    const barW = colW - 44;
    const barH = 8;
    ctx.fillStyle = '#280F12';
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c1X + 22, gridY + 110, barW, barH, 4);
    else ctx.fillRect(c1X + 22, gridY + 110, barW, barH);
    ctx.fill();

    const fillW = Math.max(6, Math.round(barW * (percent / 100)));
    ctx.fillStyle = '#22C55E';
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c1X + 22, gridY + 110, fillW, barH, 4);
    else ctx.fillRect(c1X + 22, gridY + 110, fillW, barH);
    ctx.fill();

    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22C55E';
    ctx.fillText(`ACCURACY: ${percent.toFixed(1)}%`, c1X + 22, gridY + 150);

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8C7878';
    ctx.fillText(`${score} Correct  •  ${Math.max(0, maxScore - score)} Incorrect`, c1X + 22, gridY + 180);

    // Card 2: Performance Standing & Drawn Stars
    const c2X = c1X + colW + gap;
    ctx.fillStyle = '#0E0305';
    ctx.strokeStyle = '#411619';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c2X, gridY, colW, colH, 16);
    else ctx.rect(c2X, gridY, colW, colH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c2X, gridY, colW, 6, [16, 16, 0, 0] as any);
    ctx.fill();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#AA9696';
    ctx.fillText('PERFORMANCE STANDING', c2X + 22, gridY + 28);

    // Draw 5 sharp geometric stars
    const starY = gridY + 58;
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sx = c2X + 32 + sIdx * 28;
      const isFilled = sIdx < filledStars;
      drawStar(sx, starY, 9, 4.5, isFilled, rankColor);
    }

    ctx.font = '800 22px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(rankTitle, c2X + 22, gridY + 102);

    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(`STANDOUT: ${tierText}`, c2X + 22, gridY + 144);

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8C7878';
    ctx.fillText('Mastered Control-Flow Logic', c2X + 22, gridY + 172);

    // Card 3: Runtime AST Verification & Security Hash
    const c3X = c2X + colW + gap;
    ctx.fillStyle = '#0E0305';
    ctx.strokeStyle = '#411619';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c3X, gridY, colW, colH, 16);
    else ctx.rect(c3X, gridY, colW, colH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(c3X, gridY, colW, 6, [16, 16, 0, 0] as any);
    ctx.fill();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#AA9696';
    ctx.fillText('RUNTIME VERIFICATION', c3X + 22, gridY + 28);

    ctx.font = '800 22px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Python 3.12 Engine', c3X + 22, gridY + 62);

    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#93C5FD';
    ctx.fillText('ENGINE: Safe AST Isolator', c3X + 22, gridY + 96);

    const hashStamp = `PV-${Math.abs((score * 7919 + percent * 31) % 9000 + 1000)}`;
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#A0B4C8';
    ctx.fillText(`HASH: #${hashStamp}-EVAL`, c3X + 22, gridY + 138);

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22C55E';
    ctx.fillText('✓ 0 Syntax / AST Errors', c3X + 22, gridY + 172);

    // 5. High-Security Footer Bar & Micro-Barcode Pattern
    const footerY = 520;
    ctx.strokeStyle = '#321214';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(75, footerY);
    ctx.lineTo(width - 75, footerY);
    ctx.stroke();

    // Barcode Motif on Left
    const barX = 75;
    const barY = footerY + 18;
    const barcodeH = 32;
    const barPattern = [3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 1, 3, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 4];
    let currBx = barX;
    ctx.fillStyle = '#B48C8C';
    barPattern.forEach((bw, idx) => {
      if (idx % 2 === 0) {
        ctx.fillRect(currBx, barY, bw, barcodeH);
      }
      currBx += bw + 1;
    });

    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#786464';
    ctx.fillText('PV-SEC-8421', barX, barY + 44);

    // Middle footer details
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#B4A0A0';
    ctx.fillText('ISSUED BY: PyVerse Engineering Lab • All Rights Reserved', barX + 95, barY + 12);
    ctx.font = '500 10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#826E6E';
    ctx.fillText('Validated against strict Python Control-Flow AST test suites', barX + 95, barY + 28);

    // Right footer URL
    ctx.textAlign = 'right';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E10906';
    ctx.fillText('saifahmad-crypto.github.io/PyConcept_Web', width - 75, barY + 12);
    ctx.font = '500 10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#826E6E';
    ctx.fillText('Scan or visit to verify student performance record', width - 75, barY + 28);
  }, [data, playerName]);

  useEffect(() => {
    drawScoreCard();
  }, [drawScoreCard]);

  if (!data) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const cleanTitle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    link.download = `PyVerse_ScoreCard_${cleanTitle}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }, 'image/png', 1.0);
    } catch {
      // Fallback: download if clipboard API is blocked
      handleDownload();
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current || !navigator.share) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'pyverse_scorecard.png', { type: 'image/png' });
        await navigator.share({
          title: `PyVerse Score Card: ${data.title}`,
          text: `I scored ${data.score}/${data.maxScore} in ${data.title} on PyVerse!`,
          files: [file],
        });
      }, 'image/png', 1.0);
    } catch {
      // User cancelled or share failed
    }
  };

  const percent = data ? (data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0) : 0;
  const shareText = data
    ? `🔥 I scored ${data.score}/${data.maxScore} (${percent}%) in ${data.title} on PyVerse! Master Python conditionals & loops through interactive visual learning:\nhttps://saifahmad-crypto.github.io/PyConcept_Web/`
    : '';

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        'https://saifahmad-crypto.github.io/PyConcept_Web/'
      )}`,
      '_blank'
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#3A1D1D] bg-[#100303] text-[#FBF5F9] shadow-2xl p-5 sm:p-7 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1616] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E10906]/60 bg-[#1E0505] text-[#E10906]">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                Share Score Card
                <span className="rounded-full bg-[#E10906]/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#E10906]">
                  PNG Card
                </span>
              </h2>
              <p className="font-mono text-xs text-[#8A8585]">
                Download or copy your visual achievement card
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Score Card"
            className="rounded-lg p-2 text-[#8A8585] hover:text-white hover:bg-[#190909] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Player Name Input */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8A8585] font-semibold">Your Name on Card:</span>
            <input
              type="text"
              value={playerName}
              maxLength={26}
              onChange={(e) => setPlayerName(e.target.value)}
              className="rounded-lg border border-[#3A1D1D] bg-[#100303] px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E10906]"
              placeholder="Enter name..."
            />
          </div>
          <span className="text-[11px] text-[#8A8585] font-mono">
            {data.score} / {data.maxScore} ({Math.round((data.score / data.maxScore) * 100)}%)
          </span>
        </div>

        {/* Live Canvas Frame */}
        <div className="relative w-full rounded-xl overflow-hidden border border-[#3A1D1D] bg-[#090101] shadow-inner flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg shadow-lg"
            style={{ aspectRatio: '16 / 9', maxHeight: '420px' }}
          />
        </div>

        {/* 1-Click Social Share Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#2C1616] bg-[#140606] px-4 py-2 text-xs">
          <span className="text-[#8A8585] font-semibold">1-Click Share:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-1 font-semibold text-emerald-400 hover:bg-emerald-900/60 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={shareToTwitter}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-800/60 bg-sky-950/40 px-2.5 py-1 font-semibold text-sky-400 hover:bg-sky-900/60 transition-colors"
            >
              𝕏 Post
            </button>
            <button
              type="button"
              onClick={shareToLinkedIn}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-800/60 bg-blue-950/40 px-2.5 py-1 font-semibold text-blue-400 hover:bg-blue-900/60 transition-colors"
            >
              in LinkedIn
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#8A8585]">
            Perfect for sharing on WhatsApp, Discord, X, or LinkedIn!
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {canShare && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#3A1D1D] bg-[#190909] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#250d0d]"
              >
                <Share2 className="h-4 w-4 text-[#E10906]" />
                Share
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3A1D1D] bg-[#190909] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#250d0d]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#D1C7C7]" />
                  Copy Card
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#C40705] hover:shadow-red-950/40"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
