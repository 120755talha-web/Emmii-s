import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Check,
  Trash2,
  Sparkles,
  FileText,
  Loader2,
  Image as ImageIcon,
  PenLine,
  Download,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Moment, BirthdayDataConfig } from '../types';
import {
  savePhoto,
  saveMultiplePhotos,
  clearAllCustomPhotos,
  getMomentFallbackIllustration,
  getAllCustomPhotos
} from '../utils/photoStorage';
import { extractPhotosFromPdf } from '../utils/pdfExtractor';
import { savePersistentBirthdayData, resetPersistentBirthdayData } from '../utils/contentStorage';

interface PhotoUploadModalProps {
  isOpen: boolean;
  moments: Moment[];
  customPhotos: Record<string, string>;
  birthdayData: BirthdayDataConfig;
  onClose: () => void;
  onPhotosUpdated: () => void;
  onContentUpdated: (newContent: Partial<BirthdayDataConfig>) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  moments,
  customPhotos,
  birthdayData,
  onClose,
  onPhotosUpdated,
  onContentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'writings' | 'backup'>('photos');
  const [selectedMomentId, setSelectedMomentId] = useState<number | 'hero'>(1);
  const [uploading, setUploading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Editable writings state initialized from birthdayData
  const [personName, setPersonName] = useState(birthdayData.personName);
  const [shortName, setShortName] = useState(birthdayData.shortName);
  const [mainTitle, setMainTitle] = useState(birthdayData.mainTitle);
  const [subtitle, setSubtitle] = useState(birthdayData.subtitle);
  const [salutation, setSalutation] = useState(birthdayData.birthdayLetter.salutation);
  const [paragraphs, setParagraphs] = useState<string[]>([...birthdayData.birthdayLetter.paragraphs]);
  const [closing, setClosing] = useState(birthdayData.birthdayLetter.closing);
  const [signOff, setSignOff] = useState(birthdayData.birthdayLetter.signOff);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPersonName(birthdayData.personName);
      setShortName(birthdayData.shortName);
      setMainTitle(birthdayData.mainTitle);
      setSubtitle(birthdayData.subtitle);
      setSalutation(birthdayData.birthdayLetter.salutation);
      setParagraphs([...birthdayData.birthdayLetter.paragraphs]);
      setClosing(birthdayData.birthdayLetter.closing);
      setSignOff(birthdayData.birthdayLetter.signOff);
    }
  }, [isOpen, birthdayData]);

  if (!isOpen) return null;

  // Handle PDF upload
  const handlePdfUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);
    setPdfStatus('Reading PDF pages and extracting photos...');

    try {
      const extractedPages = await extractPhotosFromPdf(file, (current, total) => {
        setPdfStatus(`Extracting photo page ${current} of ${total}...`);
      });

      if (extractedPages.length === 0) {
        alert('No pages found in this PDF file.');
        setUploading(false);
        setPdfStatus(null);
        return;
      }

      setPdfStatus(`Saving ${extractedPages.length} photos permanently to server & browser...`);

      const batch: Record<string, string> = {};
      // Page 1 is set to Hero background as well
      if (extractedPages[0]) {
        batch['hero'] = extractedPages[0].dataUrl;
      }

      // Assign each page directly to Moment 1..N (1..10)
      for (let i = 0; i < extractedPages.length && i < 10; i++) {
        const momentId = i + 1;
        batch[`moment_${momentId}`] = extractedPages[i].dataUrl;
      }

      await saveMultiplePhotos(batch);

      setPdfStatus(null);
      setUploading(false);
      setSaveSuccessMsg(`Successfully saved ${extractedPages.length} photos permanently!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
      onPhotosUpdated();
    } catch (err) {
      console.error('Error processing PDF:', err);
      alert('Could not extract photos from this PDF. You can also select the images directly.');
      setUploading(false);
      setPdfStatus(null);
    }
  };

  // Handle image files upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (files[0].type === 'application/pdf' || files[0].name.toLowerCase().endsWith('.pdf')) {
      return handlePdfUpload(files);
    }

    setUploading(true);

    try {
      if (files.length === 1 && selectedMomentId !== null) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          const key = selectedMomentId === 'hero' ? 'hero' : `moment_${selectedMomentId}`;
          await savePhoto(key, dataUrl);
          onPhotosUpdated();
          setUploading(false);
          setSaveSuccessMsg(`Photo for ${key} saved permanently!`);
          setTimeout(() => setSaveSuccessMsg(null), 3000);
        };
        reader.readAsDataURL(file);
      } else {
        const batch: Record<string, string> = {};
        const promises: Promise<void>[] = [];

        for (let i = 0; i < Math.min(files.length, 10); i++) {
          const file = files[i];
          const momentId = i + 1;
          const p = new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              batch[`moment_${momentId}`] = dataUrl;
              resolve();
            };
            reader.readAsDataURL(file);
          });
          promises.push(p);
        }

        await Promise.all(promises);
        if (files[0]) {
          batch['hero'] = batch['moment_1'];
        }

        await saveMultiplePhotos(batch);
        onPhotosUpdated();
        setUploading(false);
        setSaveSuccessMsg(`Saved ${files.length} photos permanently!`);
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Upload error', err);
      setUploading(false);
    }
  };

  // Save customized writings
  const handleSaveWritings = async () => {
    const updated: Partial<BirthdayDataConfig> = {
      personName,
      shortName,
      mainTitle,
      subtitle,
      birthdayLetter: {
        ...birthdayData.birthdayLetter,
        salutation,
        paragraphs,
        closing,
        signOff,
      },
    };

    await savePersistentBirthdayData(updated);
    onContentUpdated(updated);
    setSaveSuccessMsg('All writings and messages saved permanently to server & browser!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Export full backup as JSON
  const handleExportBackup = async () => {
    const allPhotos = await getAllCustomPhotos();
    const backupObj = {
      version: 1,
      exportDate: new Date().toISOString(),
      recipient: personName,
      photos: allPhotos,
      content: {
        personName,
        shortName,
        mainTitle,
        subtitle,
        birthdayLetter: {
          salutation,
          paragraphs,
          closing,
          signOff,
        },
      },
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emmi-birthday-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import backup
  const handleImportBackup = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.photos) {
          await saveMultiplePhotos(parsed.photos);
          onPhotosUpdated();
        }
        if (parsed.content) {
          await savePersistentBirthdayData(parsed.content);
          onContentUpdated(parsed.content);
        }
        setSaveSuccessMsg('Backup restored successfully! All photos and text are active.');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } catch (err) {
        alert('Could not parse backup file. Please select a valid backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Reset photos
  const handleClearPhotos = async () => {
    if (confirm('Are you sure you want to reset photos to default illustrations?')) {
      await clearAllCustomPhotos();
      onPhotosUpdated();
      setSaveSuccessMsg('Photos reset to default.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="photo-upload-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#F3D7D7] overflow-hidden p-5 sm:p-7 max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F3D7D7]">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#701A28] text-white shadow-sm">
                <Sparkles className="w-5 h-5 text-[#F4E8C1]" />
              </span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#52131D]">
                  Album & Writings Manager
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-sans text-[11px] text-emerald-700 font-medium">
                    Permanent Server & Browser Storage Active — Nothing will disappear when going live
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F3D7D7] text-[#701A28] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-3 pb-2 border-b border-[#F3D7D7]/60">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#701A28] text-white shadow-sm'
                  : 'bg-white/80 text-[#7A4B54] hover:bg-white hover:text-[#52131D]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photographs & PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('writings')}
              className={`px-4 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'writings'
                  ? 'bg-[#701A28] text-white shadow-sm'
                  : 'bg-white/80 text-[#7A4B54] hover:bg-white hover:text-[#52131D]'
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>Birthday Letter & Text</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-[#701A28] text-white shadow-sm'
                  : 'bg-white/80 text-[#7A4B54] hover:bg-white hover:text-[#52131D]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Backup & Restore</span>
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {pdfStatus && (
            <div className="mt-3 p-3 rounded-xl bg-[#701A28] text-white flex items-center gap-3 text-xs shadow-md animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="font-medium">{pdfStatus}</span>
            </div>
          )}

          {/* TAB 1: PHOTOGRAPHS */}
          {activeTab === 'photos' && (
            <div className="flex-1 overflow-y-auto py-3 pr-1 space-y-4">
              {/* PDF Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FCE7F3]/80 via-[#FAF7F2] to-[#F3D7D7]/80 border border-[#D9777F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#52131D] text-white shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#52131D]">
                      One-Click PDF Auto-Import
                    </h4>
                    <p className="font-sans text-xs text-[#7A4B54]">
                      Select your birthday PDF once to auto-extract all 10 pages and populate every photo.
                    </p>
                  </div>
                </div>
                <button
                  disabled={uploading}
                  onClick={() => pdfInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#701A28] hover:bg-[#52131D] text-white font-sans text-xs font-semibold shadow transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose PDF File</span>
                </button>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => handlePdfUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Moments Picker Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-xs font-semibold text-[#52131D] uppercase tracking-wider">
                    Moments 01 — 10 & Hero Banner
                  </span>
                  <span className="font-sans text-xs text-[#7A4B54]">
                    Click any slot to replace its picture
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {/* Hero Slot */}
                  <div
                    onClick={() => setSelectedMomentId('hero')}
                    className={`relative rounded-xl p-2 cursor-pointer border-2 transition-all text-center flex flex-col items-center ${
                      selectedMomentId === 'hero'
                        ? 'border-[#701A28] bg-white shadow-md'
                        : 'border-transparent hover:border-[#D9777F]/60 bg-white/70'
                    }`}
                  >
                    <div className="relative w-full aspect-[4/4] rounded-lg overflow-hidden bg-[#FAF7F2] mb-1 shadow-inner">
                      <img
                        src={customPhotos['hero'] || getMomentFallbackIllustration(1)}
                        alt="Hero Banner"
                        className="w-full h-full object-cover object-top"
                      />
                      {customPhotos['hero'] && (
                        <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <span className="font-serif text-xs font-bold text-[#52131D]">
                      Hero Banner
                    </span>
                    <span className="font-sans text-[10px] text-[#7A4B54]">
                      Main Background
                    </span>
                  </div>

                  {/* 10 Moments Slots */}
                  {moments.map((m) => {
                    const hasCustom = Boolean(customPhotos[`moment_${m.id}`]);
                    const isSelected = selectedMomentId === m.id;
                    const previewSrc =
                      customPhotos[`moment_${m.id}`] || getMomentFallbackIllustration(m.id);

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMomentId(m.id)}
                        className={`relative rounded-xl p-2 cursor-pointer border-2 transition-all text-center flex flex-col items-center ${
                          isSelected
                            ? 'border-[#701A28] bg-white shadow-md'
                            : 'border-transparent hover:border-[#D9777F]/60 bg-white/70'
                        }`}
                      >
                        <div className="relative w-full aspect-[4/4] rounded-lg overflow-hidden bg-[#FAF7F2] mb-1 shadow-inner">
                          <img
                            src={previewSrc}
                            alt={m.title}
                            className="w-full h-full object-cover object-top"
                          />
                          {hasCustom && (
                            <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <span className="font-serif text-xs font-bold text-[#52131D]">
                          Moment {m.numberStr}
                        </span>
                        <span className="font-sans text-[10px] text-[#7A4B54] truncate max-w-full">
                          {m.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D9777F] hover:border-[#701A28] rounded-2xl p-4 text-center cursor-pointer bg-white/60 hover:bg-white transition-all shadow-xs"
              >
                <Upload className="w-6 h-6 text-[#D9777F] mx-auto mb-1" />
                <p className="font-serif text-sm font-bold text-[#52131D]">
                  {uploading
                    ? 'Saving photograph...'
                    : selectedMomentId === 'hero'
                    ? 'Click to upload image for Hero Background Banner'
                    : selectedMomentId
                    ? `Click or drop image for Moment ${selectedMomentId}`
                    : 'Click or drop PDF / images here'}
                </p>
                <p className="font-sans text-xs text-[#7A4B54]">
                  Accepts .PDF documents, JPG, PNG, or WebP pictures.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WRITINGS & LETTER */}
          {activeTab === 'writings' && (
            <div className="flex-1 overflow-y-auto py-3 pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-xs font-semibold text-[#52131D] mb-1">
                    Sister&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#52131D] mb-1">
                    Nickname / Short Name
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#52131D] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#52131D] mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                />
              </div>

              {/* Letter Paragraphs */}
              <div className="pt-2 border-t border-[#F3D7D7]">
                <h4 className="font-serif text-base font-bold text-[#52131D] mb-2">
                  Heartfelt Birthday Letter
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-sans text-xs font-medium text-[#7A4B54] mb-1">
                      Salutation
                    </label>
                    <input
                      type="text"
                      value={salutation}
                      onChange={(e) => setSalutation(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                    />
                  </div>

                  {paragraphs.map((p, idx) => (
                    <div key={idx}>
                      <label className="block font-sans text-xs font-medium text-[#7A4B54] mb-1">
                        Paragraph {idx + 1}
                      </label>
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[idx] = e.target.value;
                          setParagraphs(updated);
                        }}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-xs font-medium text-[#7A4B54] mb-1">
                        Closing
                      </label>
                      <input
                        type="text"
                        value={closing}
                        onChange={(e) => setClosing(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-medium text-[#7A4B54] mb-1">
                        Sign-off
                      </label>
                      <input
                        type="text"
                        value={signOff}
                        onChange={(e) => setSignOff(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E8C2C2] focus:outline-none focus:ring-2 focus:ring-[#701A28] text-[#52131D]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveWritings}
                    className="px-5 py-2 rounded-xl bg-[#701A28] hover:bg-[#52131D] text-white font-sans text-xs sm:text-sm font-semibold shadow transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Writings Permanently</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8C2C2] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                    <Download className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#52131D]">
                      Download Full Album Backup (.json)
                    </h4>
                    <p className="font-sans text-xs text-[#7A4B54]">
                      Saves an exact copy of all your extracted high-resolution photos and writings to your computer. You can restore it anytime with one click.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-[#701A28] hover:bg-[#52131D] text-white font-sans text-xs font-semibold shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Backup File</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8C2C2] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <Upload className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#52131D]">
                      Restore from Backup File
                    </h4>
                    <p className="font-sans text-xs text-[#7A4B54]">
                      Select an exported backup file to restore all photos and customized writings immediately.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => backupInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F3D7D7] border border-[#701A28] text-[#701A28] font-sans text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select Backup File to Restore</span>
                </button>
                <input
                  ref={backupInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => handleImportBackup(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-3 mt-2 border-t border-[#F3D7D7] flex items-center justify-between">
            <button
              onClick={handleClearPhotos}
              className="text-xs text-rose-700 hover:text-rose-900 font-sans flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Photos
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#701A28] text-white font-sans text-xs sm:text-sm font-semibold hover:bg-[#52131D] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
