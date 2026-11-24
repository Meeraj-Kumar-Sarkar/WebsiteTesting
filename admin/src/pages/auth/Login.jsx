import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Lock,
  User
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { resolvedTheme, toggleTheme } = usePreferences();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(identifier, password);
      if (user.departments.includes('MASTER')) {
        navigate('/master/dashboard');
      } else if (user.departments.includes('SALES')) {
        navigate('/sales/dashboard');
      } else if (user.departments.includes('FINANCE')) {
        navigate('/finance/dashboard');
      } else if (user.departments.includes('MARKETING')) {
        navigate('/marketing/dashboard');
      } else {
        navigate('/master/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-serif font-black text-xl flex items-center justify-center shadow-md shadow-brand-900/20">
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
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </header>

      {/* Central Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 sm:px-6">
        <div className="card p-6 sm:p-8 shadow-xl border-subtle">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs text-muted">
              Sign in with your employee identifier or enterprise email
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                Employee ID or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. EMP-1001 or email@mountainandmemories.com"
                  className="input pl-9 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full btn btn-primary py-2.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating…' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            New employee?{' '}
            <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Register account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-muted">
        Mountain &amp; Memories Private Limited • Secure Enterprise Network
      </footer>
    </div>
  );
}
