import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'theme';

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Applies/removes the `dark-mode` class on <html>, which index.css uses to
// invert the whole app's colors — see index.css for why this approach was
// chosen (works without touching any existing page's markup/classes).
export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark-mode', theme === 'dark');
}

export default function ThemeToggle({ isScrolled }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label="Toggle dark mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-md transition duration-200 transform active:scale-95 cursor-pointer ${
        isScrolled
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-slate-900/5 text-slate-900 hover:bg-slate-900/10'
      }`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
