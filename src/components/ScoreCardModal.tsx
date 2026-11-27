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
    bgGrad.addColorStop(0, '#090101');
    bgGrad.addColorStop(0.5, '#130404');
    bgGrad.addColorStop(1, '#090101');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow
    const radGlow = ctx.createRadialGradient(width / 2, height / 2 - 20, 50, width / 2, height / 2, 600);
    radGlow.addColorStop(0, 'rgba(225, 9, 6, 0.16)');
    radGlow.addColorStop(0.6, 'rgba(225, 9, 6, 0.04)');
    radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, width, height);

    // Geometric Grid Lines
    ctx.strokeStyle = 'rgba(58, 29, 29, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer & Inner Borders
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 44, width - 88, height - 88);

    // Corner Ornaments
    const corners = [
      [44, 44],
      [width - 44, 44],
      [44, height - 44],
      [width - 44, height - 44],
    ];
    ctx.fillStyle = '#E10906';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Top Bar: PyVerse Brand & Category Pill
    // PyVerse Emblem
    ctx.save();
    const brandX = 80;
    const brandY = 80;
    ctx.translate(brandX, brandY);
    ctx.fillStyle = '#100303';
    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(0, 0, 42, 42, 10);
    else ctx.rect(0, 0, 42, 42);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#FBF5F9';
    ctx.lineWidth = 3.5;
    try {
      const p1 = new Path2D('M10 32 L10 12 C10 9, 13 8, 16 8 L24 8 C30 8, 33 11, 33 17 C33 22, 30 25, 24 25 L17 25');
      ctx.stroke(p1);
    } catch {
      ctx.strokeRect(10, 12, 14, 13);
    }
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 3;
    try {
      const p2 = new Path2D('M18 34 L18 16 L24 16 C26 16, 28 17.5, 28 19.5 C28 21.5, 26 23, 24 23 L18 23');
      ctx.stroke(p2);
    } catch {
      ctx.strokeRect(18, 16, 6, 7);
    }
    ctx.fillStyle = '#E10906';
    ctx.fillRect(26, 28, 7, 5);
    ctx.restore();

    // Brand Wordmark
    ctx.font = '800 32px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FBF5F9';
    ctx.fillText('Py', brandX + 54, brandY + 21);
    const pyW = ctx.measureText('Py').width;
    ctx.fillStyle = '#E10906';
    ctx.fillText('Verse', brandX + 54 + pyW, brandY + 21);

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A8585';
    ctx.fillText('LOGIC ARENA SCORE CARD', brandX + 54 + pyW + 90, brandY + 21);

    // Category Pill (Top Right)
    const catLabel = (category || 'OFFICIAL RESULT').toUpperCase();
    ctx.font = '700 13px "JetBrains Mono", monospace';
    const pillW = ctx.measureText(catLabel).width + 30;
    const pillX = width - 80 - pillW;
    const pillY = 80;

    ctx.fillStyle = 'rgba(225, 9, 6, 0.15)';
    ctx.strokeStyle = '#E10906';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(pillX, pillY, pillW, 36, 18);
    else ctx.rect(pillX, pillY, pillW, 36);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBF5F9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catLabel, pillX + pillW / 2, pillY + 18);

    // 3. Middle Section: Challenge Title & Recipient
    ctx.textAlign = 'center';
    ctx.font = '800 38px "Space Grotesk", system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(title, width / 2, 185);

    if (topic) {
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillStyle = '#D1C7C7';
      ctx.fillText(`TOPIC: ${topic.toUpperCase()}`, width / 2, 222);
    }

    // Player Name
    const cleanPlayer = (playerName || 'PyVerse Learner').trim();
    ctx.font = '700 24px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#E5DFDF';
    ctx.fillText(`Player: ${cleanPlayer}`, width / 2, 268);

    // 4. Center Score Presentation
    const scoreBoxY = 310;
    const scoreBoxW = 480;
    const scoreBoxH = 175;
    const scoreBoxX = width / 2 - scoreBoxW / 2;

    ctx.fillStyle = '#100303';
    ctx.strokeStyle = '#3A1D1D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') (ctx as any).roundRect(scoreBoxX, scoreBoxY, scoreBoxW, scoreBoxH, 20);
    else ctx.rect(scoreBoxX, scoreBoxY, scoreBoxW, scoreBoxH);
    ctx.fill();
    ctx.stroke();

    // Score Value
    ctx.font = '800 76px "Space Grotesk", system-ui, sans-serif';
    const scoreGrad = ctx.createLinearGradient(0, scoreBoxY, 0, scoreBoxY + 120);
    scoreGrad.addColorStop(0, '#FFFFFF');
    scoreGrad.addColorStop(1, '#FFCCCC');
    ctx.fillStyle = scoreGrad;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score} / ${maxScore}`, width / 2, scoreBoxY + 68);

    // Rank / Performance Tag
    let rankTitle = 'APPRENTICE EXPLORER';
    let stars = '★ ★ ☆ ☆ ☆';
    let rankColor = '#8A8585';

    if (percent === 100) {
      rankTitle = 'PERFECT LOGIC MASTER';
      stars = '★ ★ ★ ★ ★';
      rankColor = '#10B981';
    } else if (percent >= 80) {
      rankTitle = 'LOGIC CHAMPION';
      stars = '★ ★ ★ ★ ☆';
      rankColor = '#F59E0B';
    } else if (percent >= 60) {
      rankTitle = 'RISING PYTHON CODER';
      stars = '★ ★ ★ ☆ ☆';
      rankColor = '#3B82F6';
    }

    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillStyle = rankColor;
    ctx.fillText(`${stars}  ${rankTitle}  (${percent}%)`, width / 2, scoreBoxY + 135);

    // 5. Footer Info
    const footerY = 575;
    const nowStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // Left Footer: Date & Verifiable Stamp
    ctx.textAlign = 'left';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8A8585';
    ctx.fillText(`ISSUED: ${nowStr} · PYVERSE VERIFIED ARENA`, 80, footerY);

    ctx.font = '500 12px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#D1C7C7';
    ctx.fillText('Interactive Python Architecture & Simulation Platform', 80, footerY + 22);

    // Right Footer: Hash stamp & seal
    ctx.textAlign = 'right';
    const hashStamp = `PV-${Math.abs((score * 7919 + percent * 31) % 9000 + 1000)}`;
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E10906';
    ctx.fillText(`AUTHENTIC RESULT #${hashStamp}`, width - 80, footerY);

    ctx.font = '500 12px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#8A8585';
    ctx.fillText('saifahmad-crypto.github.io/PyConcept_Web', width - 80, footerY + 22);
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
