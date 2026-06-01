'use client';

import { useEffect } from 'react';

/**
 * PWARegister — Registers the service worker and handles iOS/Android install prompts.
 * Mounted once in RootLayout. All logic is guarded for SSR and unsupported browsers.
 */
export default function PWARegister() {
  useEffect(() => {
    // Guard: SW must be supported
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let registered = false;

    const registerSW = async () => {
      if (registered) return;
      registered = true;
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[LeanVerse PWA] Service Worker registered:', reg.scope);

        // Check for updates every 60 minutes
        const updateInterval = setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);

        return () => clearInterval(updateInterval);
      } catch (err) {
        // Non-fatal — app works normally without SW
        console.warn('[LeanVerse PWA] SW registration failed:', err);
      }
    };

    // Defer registration until page is idle to not block initial render
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => { registerSW(); });
    } else {
      // Fallback for Safari which doesn't support requestIdleCallback
      setTimeout(registerSW, 1000);
    }

    // ---- Android/Chrome "Add to Home Screen" Install Banner ----
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deferredPrompt: any = null;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      // Show a subtle install toast after 5 seconds
      setTimeout(() => showInstallToast(deferredPrompt), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  return null; // This component renders nothing
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function showInstallToast(deferredPrompt: any) {
  if (!deferredPrompt) return;
  if (typeof document === 'undefined') return;

  // Don't show if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) return;

  // Don't show if toast already exists
  if (document.getElementById('lv-install-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'lv-install-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background: linear-gradient(135deg, #059669, #0891b2);
    color: white;
    padding: 14px 20px;
    border-radius: 16px;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 20px 40px rgba(5,150,105,0.4);
    max-width: 320px;
    animation: slideUp 0.3s ease;
  `;

  toast.innerHTML = `
    <span style="font-size:20px">📲</span>
    <span>Install LeanVerse for a faster gym experience!</span>
    <button id="lv-install-btn" style="
      background: rgba(255,255,255,0.25);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    ">Install</button>
    <button id="lv-dismiss-btn" style="
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      line-height: 1;
    ">✕</button>
  `;

  document.body.appendChild(toast);

  const installBtn = document.getElementById('lv-install-btn');
  const dismissBtn = document.getElementById('lv-dismiss-btn');

  const removeToast = () => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  };

  installBtn?.addEventListener('click', async () => {
    removeToast();
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      // User declined or prompt failed — no action needed
    }
    deferredPrompt = null;
  });

  dismissBtn?.addEventListener('click', removeToast);

  // Auto-dismiss after 12 seconds
  setTimeout(removeToast, 12000);
}
