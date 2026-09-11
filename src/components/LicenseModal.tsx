import React, { useState } from 'react';
import { X, ShieldCheck, Key, CheckCircle, Sparkles, HardDrive, Zap, Award } from 'lucide-react';
import { LicenseInfo } from '../types/project';

interface LicenseModalProps {
  license: LicenseInfo;
  onSaveLicense: (license: LicenseInfo) => void;
  currency: string;
  currencySymbol: string;
  onCurrencyChange: (curr: string, symbol: string) => void;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  license,
  onSaveLicense,
  currency,
  currencySymbol,
  onCurrencyChange,
  onClose,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState(license.licenseKey || '');
  const [licensedToInput, setLicensedToInput] = useState(license.licensedTo || '');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isPro = license.tier === 'Pro Lifetime';

  const handleActivatePro = (e: React.FormEvent) => {
    e.preventDefault();
    const key = licenseKeyInput.trim();
    const licensee = licensedToInput.trim();

    if (!key) {
      setFeedbackMessage({
        type: 'error',
        text: 'Please enter a valid Pro license key to activate the Pro Edition.',
      });
      return;
    }

    if (key.length < 6) {
      setFeedbackMessage({
        type: 'error',
        text: 'License key format is too short. Please verify your order receipt.',
      });
      return;
    }

    onSaveLicense({
      status: 'active',
      licenseKey: key,
      tier: 'Pro Lifetime',
      licensedTo: licensee || 'Commercial Licensee',
      activatedAt: new Date().toISOString(),
    });

    setFeedbackMessage({
      type: 'success',
      text: 'Pro Lifetime ($19 Lifetime) activated successfully! All commercial export features are unlocked.',
    });
  };

  const handleRevertToFree = () => {
    onSaveLicense({
      status: 'active',
      licenseKey: '',
      tier: 'Free',
      licensedTo: '',
    });
    setLicenseKeyInput('');
    setLicensedToInput('');
    setFeedbackMessage({
      type: 'success',
      text: 'Switched to NEXORA Free Edition ($0).',
    });
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'USD ($) - US Dollar' },
    { code: 'EUR', symbol: '€', name: 'EUR (€) - Euro' },
    { code: 'GBP', symbol: '£', name: 'GBP (£) - British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'CAD (C$) - Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'AUD (A$) - Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'JPY (¥) - Japanese Yen' },
    { code: 'SAR', symbol: '﷼', name: 'SAR (﷼) - Saudi Riyal' },
    { code: 'CHF', symbol: 'CHF', name: 'CHF - Swiss Franc' },
  ];

  return (
    <div id="modal-license-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-license-container"
        className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1422] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">NEXORA Commercial License & Editions</h2>
              <p className="text-xs text-slate-400">Version 1.0.0 • Business Design Studio</p>
            </div>
          </div>
          <button
            id="btn-close-license-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Current Status Banner */}
          <div className="bg-[#0B0F17] border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Current Studio Tier
              </div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{isPro ? 'Pro Lifetime' : 'Free Edition'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {isPro ? '$19 Lifetime' : '$0'}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {isPro && license.licensedTo
                  ? `Licensed to: ${license.licensedTo}`
                  : 'Core business modeling, canvas, financial forecast & blueprints included.'}
              </div>
            </div>
            <div className="shrink-0 flex items-center">
              {isPro ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Commercial Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free Tier Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Editions Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Free Edition Card */}
            <div className={`p-4 rounded-xl border transition-all ${!isPro ? 'bg-sky-950/20 border-sky-500/40' : 'bg-[#0B0F17] border-white/[0.06]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">Free Edition</span>
                <span className="font-mono font-bold text-sky-400 text-sm">$0</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-3">
                Everything essential to model, validate, and strategize a new venture.
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>9-Block Business Model Canvas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Financial Model & Breakeven Analytics</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Market Sizing & Competitor Matrix</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>All 10 Curated Industry Starter Blueprints</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>JSON Project Data Backup & CSV Export</span>
                </li>
              </ul>
            </div>

            {/* Pro Edition Card */}
            <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${isPro ? 'bg-amber-950/20 border-amber-500/40' : 'bg-[#0B0F17] border-white/[0.06]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pro Edition</span>
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">$19 Lifetime</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-3">
                One-time purchase for commercial publishing and investor deliverables.
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>PowerPoint Presentation Decks (.pptx)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Executive Strategic Dossier PDF (.pdf)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Ultra-HD Slide Graphic Exports (PNG/JPG)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Commercial Attribution & Licensee Rights</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Lifetime Updates • No Monthly Fees</span>
                </li>
              </ul>
            </div>
          </div>

          {/* License Key Activation Form */}
          <form onSubmit={handleActivatePro} className="space-y-4 bg-[#0B0F17] p-4 rounded-xl border border-white/[0.08] text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{isPro ? 'Manage Pro License Key' : 'Activate Pro Lifetime ($19)'}</span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                License Key (From Gumroad, Whop, or Direct Order)
              </label>
              <input
                id="input-license-key"
                type="text"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="e.g. NEXORA-PRO-XXXX-XXXX-XXXX"
                className="w-full bg-[#111726] border border-white/[0.1] rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Keys are verified and stored locally on your device.
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Licensed Entity / Customer Name
              </label>
              <input
                id="input-licensed-to"
                type="text"
                value={licensedToInput}
                onChange={(e) => setLicensedToInput(e.target.value)}
                placeholder="Individual founder or Company name"
                className="w-full bg-[#111726] border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {feedbackMessage && (
              <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/20 border border-rose-500/30 text-rose-200'
              }`}>
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              {isPro ? (
                <button
                  type="button"
                  onClick={handleRevertToFree}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Switch to Free Edition ($0)
                </button>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Ready to upgrade? Enter your license key above.
                </div>
              )}

              <button
                id="btn-activate-license"
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isPro ? 'Update Pro License' : 'Activate Pro ($19 Lifetime)'}</span>
              </button>
            </div>
          </form>

          {/* Currency Preference */}
          <div className="bg-[#0B0F17] p-4 rounded-xl border border-white/[0.08] space-y-2 text-xs">
            <label className="text-slate-300 font-bold block">
              Default Studio Currency
            </label>
            <select
              id="select-studio-currency"
              value={currency}
              onChange={(e) => {
                const target = currencies.find(c => c.code === e.target.value);
                if (target) {
                  onCurrencyChange(target.code, target.symbol);
                }
              }}
              className="w-full bg-[#111726] border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code} className="bg-[#111726]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Standalone Offline Notice */}
          <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-white/[0.06] flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-sky-400 shrink-0" />
            <div className="text-[11px] text-slate-300 leading-snug">
              <span className="font-semibold text-white block">100% Offline-First Architecture</span>
              All business models, financial projections, and licenses are saved locally on this machine with complete data privacy.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0E1422] flex justify-end shrink-0">
          <button
            id="btn-dismiss-license"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

