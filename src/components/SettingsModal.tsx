import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  RefreshCw,
  RotateCcw,
  Settings,
  X,
} from 'lucide-react';
import { Product, StoreSettings } from '../types/jewellery';
import {
  EXPECTED_CSV_HEADERS,
  generateSampleCsvTemplate,
} from '../utils/csvParser';

interface SettingsModalProps {
  isOpen: boolean;
  settings: StoreSettings;
  isLiveMode: boolean;
  isSyncing: boolean;
  syncError: string;
  sampleProducts: Product[];
  onClose: () => void;
  onSaveSettings: (next: StoreSettings) => Promise<void>;
  onResetToDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  isLiveMode,
  isSyncing,
  syncError,
  sampleProducts,
  onClose,
  onSaveSettings,
  onResetToDemo,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [csvUrl, setCsvUrl] = useState(settings.csvUrl);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText
  );

  useEffect(() => {
    if (isOpen) {
      setStoreName(settings.storeName);
      setCsvUrl(settings.csvUrl);
      setWhatsappNumber(settings.whatsappNumber);
      setAnnouncementText(settings.announcementText);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings({
      ...settings,
      storeName: storeName.trim() || 'Sri Haridra Collections',
      csvUrl: csvUrl.trim(),
      whatsappNumber: whatsappNumber.trim() || '916305085353',
      announcementText:
        announcementText.trim() ||
        'Free Shipping on Orders Above ₹999 | Cash on Delivery Available | Direct Factory Prices',
    });
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsvTemplate(sampleProducts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jewellery_catalog_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FDFBF7] border border-[#E6DEC8] rounded-xl shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#F6F1E7] border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#5C162E]" aria-hidden="true" />
            <h2
              id="settings-modal-title"
              className="font-serif text-xl font-bold text-[#1F1A17]"
            >
              Google Sheets CSV &amp; Store Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[82vh] overflow-y-auto"
        >
          {/* Connection Status */}
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
              syncError
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                : isLiveMode
                ? 'bg-[#EFF8F3] border-[#B7DFC8] text-[#145332]'
                : 'bg-[#F6F1E7] border-[#E6DEC8] text-[#1F1A17]'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {syncError
                  ? syncError
                  : isLiveMode
                  ? 'Live Google Sheets CSV connected and synced.'
                  : 'Currently displaying built-in sample jewellery catalog (Demo Mode).'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E6DEC8] rounded text-xs font-semibold text-[#1F1A17] hover:border-[#C59B27] shrink-0"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sample CSV</span>
            </button>
          </div>

          <div>
            <label
              htmlFor="settings-csv-url"
              className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
            >
              Published Google Sheets CSV URL
            </label>
            <input
              id="settings-csv-url"
              type="url"
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
            />
            <p className="mt-1.5 text-xs text-[#635850]">
              In Google Sheets: File &rarr; Share &rarr; Publish to web &rarr; Select{' '}
              <strong>Comma-separated values (.csv)</strong>.
            </p>
          </div>

          {/* Expected Column Headers Guide */}
          <div className="p-3.5 bg-white border border-[#E6DEC8] rounded-lg">
            <p className="text-xs font-semibold text-[#1F1A17] mb-1.5">
              Required Google Sheet Column Headers
            </p>
            <p className="text-xs text-[#635850] leading-relaxed font-mono">
              {EXPECTED_CSV_HEADERS.join(' · ')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-store-name"
                className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
              >
                Store Name
              </label>
              <input
                id="settings-store-name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
              />
            </div>

            <div>
              <label
                htmlFor="settings-whatsapp"
                className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
              >
                WhatsApp Order Number (with Country Code)
              </label>
              <input
                id="settings-whatsapp"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="916305085353"
                className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-announcement"
              className="block text-xs font-semibold text-[#1F1A17] mb-1.5"
            >
              Top Announcement Offer Bar
            </label>
            <input
              id="settings-announcement"
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E6DEC8] rounded-md focus:outline-none focus:border-[#5C162E]"
            />
          </div>

          <div className="pt-3 border-t border-[#E6DEC8] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCsvUrl('');
                onResetToDemo();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#5C162E] bg-[#F6F1E7] hover:bg-[#EAE1CF] border border-[#E6DEC8] rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Use Demo Catalog</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7] text-sm font-semibold rounded-md transition-colors disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{isSyncing ? 'Syncing...' : 'Save & Sync Feed'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
