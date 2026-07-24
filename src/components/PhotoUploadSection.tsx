import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Check, Image as ImageIcon, Loader2, Sparkles, User, Tag } from 'lucide-react';
import { uploadGuestPhoto } from '../lib/supabase';
import { PhotoItem } from '../types';

interface PhotoUploadSectionProps {
  onPhotoUploaded?: (photo: PhotoItem) => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ onPhotoUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setErrorMsg('');
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setErrorMsg('');

    const res = await uploadGuestPhoto(file, uploaderName, caption, (p) => setProgress(p));
    setUploading(false);

    if (res.success && res.photo) {
      setUploadSuccess(true);
      onPhotoUploaded?.(res.photo);
    } else {
      setErrorMsg(res.error || 'Failed to upload photo.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setUploaderName('');
    setCaption('');
    setProgress(0);
    setUploadSuccess(false);
    setErrorMsg('');
  };

  return (
    <section id="photo-upload" className="py-24 bg-marble-texture relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] text-xs font-cinzel tracking-[0.25em] uppercase mb-4">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Capture The Magic</span>
          </div>
          <h2 className="font-cormorant text-4xl sm:text-6xl text-white font-light">
            Share Your <span className="font-cinzel text-[#D4AF37] italic">Photos</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base font-cinzel text-gray-400 tracking-widest uppercase">
            Upload your memories directly to Farah & Seif’s live wedding album
          </p>
        </motion.div>

        {/* Upload Container Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30">
          <AnimatePresence mode="wait">
            {!uploadSuccess ? (
              <form onSubmit={handleUpload} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-sm">
                    {errorMsg}
                  </div>
                )}

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    preview
                      ? 'border-[#D4AF37] bg-[#0B152C]/90'
                      : 'border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#0B152C]/40 hover:bg-[#0B152C]/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />

                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={preview}
                        alt="Upload preview"
                        className="max-h-60 rounded-xl object-contain border border-[#D4AF37]/30 mb-4 shadow-xl"
                      />
                      <span className="font-cinzel text-xs text-[#E5C158] tracking-widest uppercase">
                        Click or tap to change photo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#0B152C] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div className="font-cinzel text-sm text-white font-semibold tracking-wider uppercase">
                        Drag & Drop or Tap to Upload
                      </div>
                      <p className="text-xs text-gray-400 font-sans max-w-xs">
                        High resolution images will automatically be optimized before upload.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Inputs */}
                {file && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Maya & Omar"
                            value={uploaderName}
                            onChange={(e) => setUploaderName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-cinzel text-xs tracking-widest text-[#E5C158] uppercase mb-2">
                          Caption / Location
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Sunset Ceremony Toast"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B152C]/80 border border-[#D4AF37]/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {uploading && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-cinzel text-[#E5C158]">
                          <span>Compressing & Uploading...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#0B152C] overflow-hidden border border-[#D4AF37]/20">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA820A] text-[#050B18] font-cinzel text-xs font-bold tracking-[0.2em] uppercase shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                          </span>
                        ) : (
                          'Publish To Gallery'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            ) : (
              /* Success Card */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#0B152C] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-cormorant text-3xl text-white font-medium">Photo Added to Wedding Album!</h3>
                <p className="font-sans text-xs text-gray-300">
                  Thank you for contributing to Farah & Seif’s memories. Your image is live in the gallery below.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full bg-[#0B152C] border border-[#D4AF37]/30 text-[#E5C158] font-cinzel text-xs tracking-wider uppercase hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors"
                >
                  Upload Another Photo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
