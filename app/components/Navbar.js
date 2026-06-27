
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'techcart-premium';

export default function Navbar() {
  const [isPremium, setIsPremium] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsPremium(stored === 'true');
  }, []);

  const showBadge = mounted && isPremium === true;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ⚡ TechCart
        </Link>
        <div className="flex items-center gap-3">
          {showBadge && (
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300">
              ✓ Premium
            </span>
          )}
          <Link
            href="/premium"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Go Premium
          </Link>
        </div>
      </nav>
    </header>
  );
}