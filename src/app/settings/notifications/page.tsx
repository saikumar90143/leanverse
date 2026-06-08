'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock, Flame, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/layout/AuthProvider';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationSettings() {
  const { user, loading: authLoading } = useAuth();
  const status = authLoading ? 'loading' : (user ? 'authenticated' : 'unauthenticated');
  
  const [preferences, setPreferences] = useState({
    pushNotificationsEnabled: false,
    emailRemindersEnabled: false,
    streakAlertsEnabled: true,
    reminderTime: '08:00',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>(''); // 'prompt', 'granted', 'denied'

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/notifications/preferences')
        .then(res => res.json())
        .then(data => {
          if (data.preferences) {
            setPreferences(data.preferences);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));

      if ('Notification' in window) {
        setPushStatus(Notification.permission);
      }
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const updatePreference = async (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setSaving(true);
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (!enabled) {
      updatePreference('pushNotificationsEnabled', false);
      // We could also unsubscribe from push here via DELETE /api/notifications/subscribe
      return;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Push notifications are not supported in your browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission !== 'granted') {
        alert("You need to grant notification permissions in your browser settings.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        console.error("No VAPID public key available in environment");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      updatePreference('pushNotificationsEnabled', true);
      alert("Push notifications enabled!");
    } catch (err) {
      console.error("Error subscribing to push", err);
      alert("Failed to subscribe to push notifications.");
    }
  };

  if (loading) return <div className="text-center py-20">Loading preferences...</div>;

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-2xl font-black text-foreground">Login Required</h2>
        <p className="text-muted text-sm">Please log in to manage your notification preferences.</p>
        <Link href="/login" className="inline-block mt-4 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Notification Settings</h1>
        <p className="text-muted text-sm mt-1">Control how and when LeanVerse reaches out to you.</p>
      </div>

      <div className="glass rounded-3xl p-6 border border-border/10 space-y-6 relative overflow-hidden">
        {saving && (
          <div className="absolute top-4 right-6 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded flex items-center space-x-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            <span>Saving...</span>
          </div>
        )}

        {/* Push Notifications */}
        <div className="flex items-start justify-between border-b border-border/10 pb-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Daily Workout Push Alerts</h3>
              <p className="text-xs text-muted leading-relaxed mt-1 max-w-sm">
                Receive a daily notification on this device reminding you to log your workout.
              </p>
              {pushStatus === 'denied' && (
                <span className="text-[10px] text-red-400 font-bold mt-2 block">
                  Permissions denied in browser settings. Please enable them to use this feature.
                </span>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-2">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={preferences.pushNotificationsEnabled}
              onChange={(e) => handlePushToggle(e.target.checked)}
              disabled={pushStatus === 'denied'}
            />
            <div className="w-11 h-6 bg-secondary dark:bg-card/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Email Digest */}
        <div className="flex items-start justify-between border-b border-border/10 pb-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Weekly Email Digest</h3>
              <p className="text-xs text-muted leading-relaxed mt-1 max-w-sm">
                Get a weekly recap of top articles, nutrition tips, and a quick prompt to check your progress.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-2">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={preferences.emailRemindersEnabled}
              onChange={(e) => updatePreference('emailRemindersEnabled', e.target.checked)}
            />
            <div className="w-11 h-6 bg-secondary dark:bg-card/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Streak Alerts */}
        <div className="flex items-start justify-between border-b border-border/10 pb-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Streak Saver Alerts</h3>
              <p className="text-xs text-muted leading-relaxed mt-1 max-w-sm">
                Get an emergency push notification if you haven't logged your workout and your streak is about to break.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-2">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={preferences.streakAlertsEnabled}
              onChange={(e) => updatePreference('streakAlertsEnabled', e.target.checked)}
            />
            <div className="w-11 h-6 bg-secondary dark:bg-card/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Reminder Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2">
          <div className="flex items-start space-x-4 mb-4 sm:mb-0">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground">Reminder Time</h3>
              <p className="text-xs text-muted leading-relaxed mt-1 max-w-sm">
                When do you usually hit the gym? We'll tailor push reminders around this time.
              </p>
            </div>
          </div>
          <input
            type="time"
            value={preferences.reminderTime}
            onChange={(e) => updatePreference('reminderTime', e.target.value)}
            className="bg-secondary dark:bg-card/10 border border-slate-350/15 dark:border-border rounded-xl px-4 py-2 text-sm font-bold text-foreground focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>
      
      <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-muted mt-8">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>We respect your inbox. Unsubscribe at any time.</span>
      </div>
    </div>
  );
}
