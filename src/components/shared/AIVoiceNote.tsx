'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Sparkles } from 'lucide-react';

const SCRIPT = "Welcome to LeanVerse! I am your AI fitness assistant. We generate custom workout plans, meal plans, and track your gamified progress to help you build your dream physique. Click the Generate Diet Plan button or start the Workout Wizard to begin.";

export default function AIVoiceNote() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(SCRIPT);
      utterance.rate = 0.95; // slightly slower for clarity
      utterance.pitch = 1.1; // slightly higher pitch
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
    }
  }, []);

  const togglePlay = () => {
    if (!synthRef.current || !utteranceRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any ongoing speech before starting new
      synthRef.current.cancel();
      
      // Try to pick an English voice, preferably female if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) {
        utteranceRef.current.voice = preferredVoice;
      }
      
      synthRef.current.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={togglePlay}
      className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center space-x-2 border-2 ${
        isPlaying 
          ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/25' 
          : 'bg-transparent text-foreground border-foreground/30 hover:border-amber-500 hover:text-amber-500'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {isPlaying ? (
          <>
            <Square className="w-5 h-5" fill="currentColor" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
          </>
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </div>
      <span>{isPlaying ? 'Stop AI Audio' : 'Listen to AI Intro'}</span>
      {!isPlaying && <Sparkles className="w-4 h-4 ml-1 opacity-50" />}
    </button>
  );
}
