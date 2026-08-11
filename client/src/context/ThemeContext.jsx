import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Available color accent themes (primary + secondary pairs)
export const ACCENT_THEMES = [
  { id: 'blue-violet',  label: 'Ocean Blue',   primary: '#2563EB', secondary: '#7C3AED', preview: ['#2563EB','#7C3AED'] },
  { id: 'emerald-teal', label: 'Emerald',       primary: '#059669', secondary: '#0D9488', preview: ['#059669','#0D9488'] },
  { id: 'rose-pink',    label: 'Rose Pink',     primary: '#E11D48', secondary: '#DB2777', preview: ['#E11D48','#DB2777'] },
  { id: 'amber-orange', label: 'Amber Glow',    primary: '#D97706', secondary: '#EA580C', preview: ['#D97706','#EA580C'] },
  { id: 'indigo-sky',   label: 'Indigo Sky',    primary: '#4F46E5', secondary: '#0EA5E9', preview: ['#4F46E5','#0EA5E9'] },
  { id: 'fuchsia-purple',label: 'Fuchsia',      primary: '#C026D3', secondary: '#7C3AED', preview: ['#C026D3','#7C3AED'] },
  { id: 'slate-dark',   label: 'Midnight',      primary: '#334155', secondary: '#475569', preview: ['#334155','#475569'] },
];

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem('accentTheme') || 'indigo-sky';
  });

  // Apply dark/light mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Apply accent color CSS variables dynamically
  useEffect(() => {
    const found = ACCENT_THEMES.find(t => t.id === accentTheme);
    if (!found) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', found.primary);
    root.style.setProperty('--color-primary-hover', darken(found.primary));
    root.style.setProperty('--color-secondary', found.secondary);
    localStorage.setItem('accentTheme', accentTheme);
  }, [accentTheme]);

  const toggleTheme = () => setDarkMode(prev => !prev);
  const changeAccent = (themeId) => setAccentTheme(themeId);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, accentTheme, changeAccent, ACCENT_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Simple hex color darkener utility
function darken(hex, amount = 20) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
