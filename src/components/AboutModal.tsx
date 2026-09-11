import React from 'react';
import { X, Mail, Shield, Sparkles, Cpu, Award } from 'lucide-react';
import { LicenseInfo } from '../types/project';

interface AboutModalProps {
  license?: LicenseInfo;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ license, onClose }) => {
  const isPro = license?.tier === 'Pro Lifetime';

  const handleOpenExternal = (url: string) => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div id="modal-about-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-about-container"
        className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1422]">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            About NEXORA
          </span>
          <button
            id="btn-close-about-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          {/* App Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-500 p-[2px] shadow-xl">
            <div className="w-full h-full bg-[#0E1524] rounded-[14px] flex items-center justify-center">
              <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                N
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              NEXORA Business Design Studio
            </h2>
            <p className="text-xs text-sky-400 font-mono mt-0.5">
              Version 1.0.0 (Commercial Release)
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            A connected workspace for turning business ideas into structured businesses.
          </p>

          <div className="bg-[#0B0F17] border border-white/[0.06] rounded-xl p-3 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                {isPro ? <Award className="w-3.5 h-3.5 text-amber-400" /> : <Shield className="w-3.5 h-3.5 text-sky-400" />}
                <span>License Status:</span>
              </span>
              <span className={`font-semibold ${isPro ? 'text-amber-300' : 'text-sky-300'}`}>
                {isPro ? 'Pro Lifetime ($19)' : 'Free Edition ($0)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Architecture:</span>
              </span>
              <span className="text-slate-200 font-medium">Standalone Offline-First Engine</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Publishing:</span>
              </span>
              <span className="text-slate-200 font-medium">PPTX, PDF, CSV, PNG, JPG</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Support:</span>
              </span>
              <button 
                onClick={() => handleOpenExternal('mailto:support@nexora.studio')}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                support@nexora.studio
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            Copyright © 2026 NEXORA Studio. All rights reserved.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0E1422] flex justify-center">
          <button
            id="btn-dismiss-about"
            onClick={onClose}
            className="px-6 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
