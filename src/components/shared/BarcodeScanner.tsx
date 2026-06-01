'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onResult: (decodedText: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        onResult(decodedText);
      },
      (error) => {
        // Ignored, triggers constantly when no barcode is in view
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl border border-slate-200/20 dark:border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-center font-black text-slate-800 dark:text-slate-100 mb-6 tracking-wide">Scan Food Barcode</h3>
        <div id="reader" className="w-full rounded-2xl overflow-hidden bg-black shadow-inner" />
        <p className="text-[10px] font-bold text-center text-slate-500 mt-6">
          Hold your phone steady and center the barcode within the frame.
        </p>
      </div>
    </div>
  );
}
