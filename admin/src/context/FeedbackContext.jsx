import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { usePreferences } from './PreferencesContext.jsx';

/**
 * App-wide feedback primitives that replace window.alert / window.confirm:
 *
 *   const toast = useToast();
 *   toast.success('Saved');  toast.error(err.message);
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: 'Delete?', message: '…', tone: 'danger' }))) return;
 *   const reason = await confirm({ title: 'Reject', input: { label: 'Reason', required: true } }); // string | null
 */

const ToastContext = createContext(null);
const ConfirmContext = createContext(null);

const TOAST_STYLES = {
  success: { icon: CheckCircle2, ring: 'text-emerald-600', bar: 'bg-emerald-500' },
  error: { icon: XCircle, ring: 'text-rose-600', bar: 'bg-rose-500' },
  warning: { icon: AlertTriangle, ring: 'text-amber-600', bar: 'bg-amber-500' },
  info: { icon: Info, ring: 'text-blue-600', bar: 'bg-blue-500' },
};

let idSeq = 0;

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const { prefs } = usePreferences();

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idSeq;
      const duration = opts.duration ?? (type === 'error' ? 6000 : 3800);
      setToasts((t) => [...t.slice(-4), { id, type, message: String(message || ''), title: opts.title }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      success: (m, o) => push('success', m, o),
      error: (m, o) => push('error', m, o),
      warning: (m, o) => push('warning', m, o),
      info: (m, o) => push('info', m, o),
      dismiss,
    }),
    [push, dismiss]
  );

  const confirm = useCallback(
    (opts = {}) => {
      // Users may opt out of confirmation prompts for simple yes/no actions.
      if (!opts.input && !opts.force && prefs.confirmDestructive === false) return Promise.resolve(true);
      return new Promise((resolve) => setDialog({ ...opts, resolve }));
    },
    [prefs.confirmDestructive]
  );

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}

        {/* Toast stack */}
        <div className="fixed z-[100] bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-2 sm:w-96 pointer-events-none" aria-live="polite">
          {toasts.map((t) => {
            const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
            const Icon = s.icon;
            return (
              <div
                key={t.id}
                role="status"
                className="pointer-events-auto relative overflow-hidden flex items-start gap-3 rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-lift animate-slide-in-right"
              >
                <span className={`absolute left-0 inset-y-0 w-1 ${s.bar}`} />
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${s.ring}`} />
                <div className="flex-1 min-w-0">
                  {t.title && <div className="text-sm font-semibold text-slate-900">{t.title}</div>}
                  <div className="text-sm text-slate-700 break-words">{t.message}</div>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-1 -m-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {dialog && <ConfirmDialog dialog={dialog} onDone={() => setDialog(null)} />}
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

function ConfirmDialog({ dialog, onDone }) {
  const {
    title = 'Are you sure?',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    tone = 'default',
    input,
    resolve,
  } = dialog;
  const [value, setValue] = useState(input?.defaultValue || '');
  const inputRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    (input ? inputRef.current : confirmRef.current)?.focus();
  }, [input]);

  const close = (result) => {
    resolve(result);
    onDone();
  };

  const cancelResult = input ? null : false;
  const canSubmit = !input?.required || value.trim().length > 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close(cancelResult);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    close(input ? value.trim() : true);
  };

  const danger = tone === 'danger';

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={() => close(cancelResult)} />
      <form
        onSubmit={submit}
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-lift animate-pop-in p-6"
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              danger ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-700'
            }`}
          >
            {danger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {message && <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">{message}</p>}
            {input && (
              <div className="mt-4">
                {input.label && (
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {input.label} {input.required && <span className="text-rose-500">*</span>}
                  </label>
                )}
                {input.multiline ? (
                  <textarea
                    ref={inputRef}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={input.placeholder}
                    className="input resize-none"
                  />
                ) : (
                  <input
                    ref={inputRef}
                    type={input.type || 'text'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={input.placeholder}
                    className="input"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button type="button" onClick={() => close(cancelResult)} className="btn-secondary">
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="submit"
            disabled={!canSubmit}
            className={danger ? 'btn bg-rose-600 hover:bg-rose-700 text-white shadow-sm' : 'btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </form>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a FeedbackProvider');
  return ctx;
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a FeedbackProvider');
  return ctx;
}
