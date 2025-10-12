'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or default to dark
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 bg-[#1A222C] rounded-lg p-1">
        <div className="w-16 h-8"></div>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="flex items-center gap-1 bg-[#1A222C] rounded-lg p-1"
    >
      <button
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => handleThemeChange('dark')}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${
            theme === 'dark'
              ? 'bg-[#00E18D] text-black'
              : 'text-[#A9B4C0] hover:text-[#E8EEF5]'
          }
        `}
        aria-label="Dark theme"
      >
        Dark
      </button>
      <button
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => handleThemeChange('light')}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${
            theme === 'light'
              ? 'bg-[#00E18D] text-black'
              : 'text-[#A9B4C0] hover:text-[#E8EEF5]'
          }
        `}
        aria-label="Light theme"
      >
        Light
      </button>
    </div>
  );
}


