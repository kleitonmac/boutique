import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
