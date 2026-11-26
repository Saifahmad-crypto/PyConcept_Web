import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Award, Calendar, ArrowRight, X } from 'lucide-react';
import { parseVerificationFromUrl } from '../utils/certificateSecurity';

interface CertificateVerificationModalProps {
  onClose: () => void;
  onNavigateHome: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  onClose,
  onNavigateHome,
}) => {
  const certInfo = parseVerificationFromUrl();

  if (!certInfo) return null;

  const { certId, recipientName, topicId, issueDate, signature, isValid } = certInfo;

  const topicDisplayNames: Record<string, string> = {
    basics: 'Python Basics',
    conditionals: 'Conditional Statements',
    loops: 'Loops & Iteration',
  };

  const displayTopic = topicDisplayNames[topicId.toLowerCase()] || topicId || 'Python Mastery';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-[#3A1D1D] bg-[#100303] text-[#FBF5F9] shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C1616] pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                isValid
                  ? 'border-emerald-800/80 bg-emerald-950/60 text-emerald-400'
                  : 'border-rose-800/80 bg-rose-950/60 text-rose-400'
              }`}
            >
              {isValid ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                PyVerse Credential Verification
              </h2>
              <p className="font-mono text-xs text-[#8A8585]">
                {certId || 'Unknown ID'} · Public Verification Registry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8A8585] hover:text-white hover:bg-[#190909] transition-colors"
            aria-label="Close verification modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verification Status Banner */}
        {isValid ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-base">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Official PyVerse Certificate Verified Authentic</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              This certificate has been cryptographically validated against PyVerse’s official credential key. It was legitimately issued to the learner listed below.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-base">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Verification Failed · Tampered or Unrecognized</span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              The signature provided does not match the certificate details. This certificate cannot be confirmed as an authentic PyVerse credential.
            </p>
          </div>
        )}

        {/* Certificate Details */}
        <div className="rounded-xl border border-[#2C1616] bg-[#190909] p-4 divide-y divide-[#2C1616] text-xs">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Recipient Name</span>
            <span className="font-display font-bold text-white text-sm">
              {recipientName || 'Unknown Learner'}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Completed Curriculum</span>
            <span className="font-semibold text-[#E10906] flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              {displayTopic}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Certificate ID</span>
            <span className="font-mono font-bold text-white tracking-wider">
              {certId}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Date of Issue</span>
            <span className="text-white flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#8A8585]" />
              {issueDate || '—'}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Digital Signature</span>
            <span className="font-mono text-[11px] text-emerald-400 truncate max-w-[200px]" title={signature}>
              {signature || 'MISSING'}
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#8A8585] font-medium">Issuing Body</span>
            <span className="text-[#CFC8C8]">PyVerse Academic Council</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#3A1D1D] bg-[#190909] px-4 py-2.5 text-xs font-semibold text-[#CFC8C8] hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateHome();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#C40705] transition-colors"
          >
            <span>Explore PyVerse</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
