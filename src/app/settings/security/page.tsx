'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter } from 'next/navigation';

export default function SecuritySettings() {
  const { user } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If user is Google auth, they shouldn't be here, but we'll show a message just in case
  if (user?.authProvider === 'google') {
    return (
      <div className="glass rounded-3xl p-8 border border-border/10 text-center">
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground">Google Managed Account</h2>
        <p className="text-muted text-sm mt-2">
          Your account security and password are managed by Google. You cannot change your password here.
        </p>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to change password.');
      } else {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 md:p-8 border border-border/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground">Change Password</h2>
            <p className="text-sm text-muted">Update your account password to stay secure.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3 text-red-500">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start space-x-3 text-emerald-500">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">Password successfully updated!</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-secondary dark:bg-card border-none text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-secondary dark:bg-card border-none text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              placeholder="Enter new password (min. 6 characters)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-secondary dark:bg-card border-none text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
