import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, KeyRound, AlertCircle, ArrowRight, Shield, UserCheck, DollarSign, Camera } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('EMP-1001');
  const [password, setPassword] = useState('Password@123');
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
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (id, pwd) => {
    setIdentifier(id);
    setPassword(pwd);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 text-white font-serif font-black text-2xl shadow-xl border-2 border-brand-400 mb-4">
          M
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white font-serif">
          Mountain & Memories
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-mono tracking-wider uppercase">
          Internal Administration & Operations Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-3 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Employee ID or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. EMP-1001 or admin@mountainandmemories.com"
                className="mt-1 block w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              One-Click Role Profiles (Demo)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('EMP-1001', 'Password@123')}
                className="p-2 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-left transition flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <div>
                  <div className="font-semibold text-purple-900">Master / CEO</div>
                  <div className="text-[10px] text-purple-600 font-mono">EMP-1001</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('EMP-1002', 'Password@123')}
                className="p-2 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-left transition flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Sales Lead</div>
                  <div className="text-[10px] text-blue-600 font-mono">EMP-1002</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('EMP-1003', 'Password@123')}
                className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition flex items-center gap-2"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-900">Finance Officer</div>
                  <div className="text-[10px] text-emerald-600 font-mono">EMP-1003</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('EMP-1004', 'Password@123')}
                className="p-2 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-left transition flex items-center gap-2"
              >
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <div>
                  <div className="font-semibold text-amber-900">Media / Photo</div>
                  <div className="text-[10px] text-amber-600 font-mono">EMP-1004</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            New employee?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-800">
              Register account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
