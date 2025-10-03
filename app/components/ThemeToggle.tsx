'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('betframe-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('betframe-theme', newTheme ? 'dark' : 'light');
    
    // Apply theme to document
    document.documentElement.classList.toggle('light-theme', !newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-surface hover:bg-surface-hover transition-colors duration-200 border border-border"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent" />
      ) : (
        <Moon className="w-5 h-5 text-fg" />
      )}
    </button>
  );
}