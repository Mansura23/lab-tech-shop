
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'techcart-premium';

export default function PremiumPage() {
  const [isPremium, setIsPremium] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsPremium(stored === 'true');
  }, []);

  // Əgər artıq premiumdursa, mesaj göstər
  if (mounted && isPremium === true) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
          You're already Premium!
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Enjoy an ad‑free experience. Thank you for supporting TechCart.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload(); // dərhal yenilə
          }}
          className="mt-6 rounded-full bg-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
        >
          Cancel Premium (restore ads)
        </button>
      </div>
    );
  }

  // Validasiya funksiyası
  const validate = () => {
    const e = {};
    if (!form.cardholder.trim() || form.cardholder.trim().length < 2) {
      e.cardholder = 'Name must be at least 2 characters.';
    }
    const digits = form.cardNumber.replace(/\s/g, '');
    if (!digits || digits.length < 16 || digits.length > 19 || !/^\d+$/.test(digits)) {
      e.cardNumber = 'Enter a valid card number (16–19 digits).';
    }
    if (!form.expiry || !/^\d{2}\/\d{2}$/.test(form.expiry)) {
      e.expiry = 'Use MM/YY format.';
    } else {
      const [mm, yy] = form.expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (mm < 1 || mm > 12) e.expiry = 'Invalid month.';
      else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        e.expiry = 'Card has expired.';
      }
    }
    if (!form.cvc || !/^\d{3,4}$/.test(form.cvc)) {
      e.cvc = 'CVC must be 3 or 4 digits.';
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === 'cardNumber') {
      const raw = val.replace(/\s/g, '');
      const chunks = raw.match(/.{1,4}/g) || [];
      val = chunks.join(' ');
    }
    if (field === 'expiry') {
      const raw = val.replace(/\D/g, '');
      if (raw.length >= 2 && !val.includes('/')) {
        val = raw.slice(0, 2) + '/' + raw.slice(2, 4);
      } else if (raw.length < 2) {
        val = raw;
      } else {
        val = raw.slice(0, 2) + '/' + raw.slice(2, 4);
      }
    }
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    // Mock ödəniş
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsSubmitting(false);
      setSubmitted(true);

      // **ƏN ƏSAS HİSSƏ: səhifəni tam yenilə**
      window.location.reload();
    }, 800);
  };

  // Əgər təsdiq mesajı göstərilirsə (submitted=true), amma reload edəcəyik, buna görə bu hissə işləməyəcək.
  // Amma təhlükəsizlik üçün saxlayırıq.
  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
          Payment complete, ads removed!
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Thank you for supporting TechCart.
        </p>
      </div>
    );
  }

  // Form
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
        <h1 className="text-2xl font-bold tracking-tight">Upgrade to Premium</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Pay once, remove ads forever. ✨
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cardholder Name
            </label>
            <input
              type="text"
              value={form.cardholder}
              onChange={handleChange('cardholder')}
              className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${
                errors.cardholder
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-black/20 focus:ring-indigo-300 dark:border-white/20 dark:bg-zinc-800'
              }`}
              placeholder="John Doe"
            />
            {errors.cardholder && <p className="text-red-500 text-xs mt-1">{errors.cardholder}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Card Number
            </label>
            <input
              type="text"
              value={form.cardNumber}
              onChange={handleChange('cardNumber')}
              className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${
                errors.cardNumber
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-black/20 focus:ring-indigo-300 dark:border-white/20 dark:bg-zinc-800'
              }`}
              placeholder="4242 4242 4242 4242"
              maxLength="23"
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Expiry Date
              </label>
              <input
                type="text"
                value={form.expiry}
                onChange={handleChange('expiry')}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${
                  errors.expiry
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-black/20 focus:ring-indigo-300 dark:border-white/20 dark:bg-zinc-800'
                }`}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                CVC
              </label>
              <input
                type="text"
                value={form.cvc}
                onChange={handleChange('cvc')}
                className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${
                  errors.cvc
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-black/20 focus:ring-indigo-300 dark:border-white/20 dark:bg-zinc-800'
                }`}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-black/20 focus:ring-indigo-300 dark:border-white/20 dark:bg-zinc-800'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing…' : 'Pay $0.00 (mock)'}
          </button>
          <p className="mt-2 text-center text-xs text-zinc-500">
            This is a mock payment. No real money will be charged.
          </p>
        </form>
      </div>
    </div>
  );
}