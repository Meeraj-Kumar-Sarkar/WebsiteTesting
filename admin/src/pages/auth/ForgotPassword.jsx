import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { usePreferences } from '../../context/PreferencesContext';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Lock,
  Sun,
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ForgotPassword() {
  const { resolvedTheme, toggleTheme } = usePreferences();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/request-password-reset', { email });
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      setMessage(res.message);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Password reset failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-serif font-black text-xl flex items-center justify-center shadow-md">
            M
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-tight block text-primary leading-tight">
              Mountain &amp; Memories
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
              Internal Operations Portal
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2.5 rounded-xl border border-subtle bg-surface hover:bg-hover text-muted hover:text-primary transition shadow-sm"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 sm:px-6">
        <div className="card p-6 sm:p-8 shadow-xl border-subtle">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Password Recovery
            </h1>
            <p className="mt-1.5 text-xs text-muted">
              Secure single-use OTP verification
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-xs text-secondary leading-relaxed">
                Enter your registered corporate email address to receive a secure 6-digit verification code.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@mountainandmemories.com"
                    className="input pl-9 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2.5 text-sm font-semibold shadow-md mt-2"
              >
                {loading ? 'Dispatching OTP…' : 'Send Verification OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {message && (
                <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-800 dark:text-brand-300">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="input text-base font-mono tracking-widest text-center py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                  New Password (min 8)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-9 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2.5 text-sm font-semibold shadow-md mt-2"
              >
                {loading ? 'Updating Password…' : 'Verify & Set New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-primary">Password Reset Complete</h2>
              <p className="text-xs text-secondary leading-relaxed">
                Your credentials have been securely updated. You can now log into your account using your new password.
              </p>
              <Link
                to="/login"
                className="btn btn-primary w-full py-2.5 text-center text-xs block font-semibold shadow-md"
              >
                Sign In Now
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-muted">
            <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-secondary hover:text-primary transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-[11px] text-muted">
        Mountain &amp; Memories Private Limited • Secure Enterprise Network
      </footer>
    </div>
  );
}
