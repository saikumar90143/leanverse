'use client';

import React, { useState, useRef } from 'react';
import { RotateCw, Upload, X, Loader2 } from 'lucide-react';

interface Props {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (err: string) => void;
  className?: string;
  children: React.ReactNode;
}

export default function ImageUploader({ onUploadSuccess, onUploadError, className, children }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setRotation(0);
    }
    // Reset input so the same file can be selected again if cancelled
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyRotationAndUpload = async () => {
    if (!file || !preview) return;
    setUploading(true);

    try {
      let fileToUpload = file;

      // If rotated, use canvas to rotate the image client-side before uploading
      if (rotation !== 0) {
        fileToUpload = await new Promise<File>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(file);

            if (rotation === 90 || rotation === 270) {
              canvas.width = img.height;
              canvas.height = img.width;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            canvas.toBlob((blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                resolve(file);
              }
            }, file.type);
          };
          img.onerror = () => resolve(file);
          img.src = preview;
        });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (data.success) {
        onUploadSuccess(data.url);
        setFile(null);
        setPreview(null);
      } else {
        if (onUploadError) onUploadError(data.error);
        else alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      if (onUploadError) onUploadError(err.message);
      else alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={`relative overflow-hidden ${className || ''}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Upload Image"
        />
        <div className="pointer-events-none relative z-0">
          {children}
        </div>
      </div>

      {/* Editor Modal */}
      {preview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !uploading && setPreview(null)} />
          <div className="relative bg-card rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-border/20 z-10 flex flex-col items-center">
            <h3 className="font-black text-foreground mb-4">Edit Image</h3>
            
            <div className="w-full aspect-square bg-background/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden border border-border/10">
              <img 
                src={preview} 
                alt="Preview" 
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleRotate} 
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary dark:bg-card/10 text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                <RotateCw className="w-4 h-4" /> Rotate
              </button>
              <button 
                onClick={applyRotationAndUpload}
                disabled={uploading}
                className="flex-[2] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black rounded-xl shadow-md disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Confirm'}
              </button>
            </div>
            
            <button 
              onClick={() => setPreview(null)} 
              disabled={uploading}
              className="absolute top-4 right-4 text-muted hover:text-foreground disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
