import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check if dark mode preference is saved in localStorage and apply it
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle the dark mode state
  const toggleTheme = () => {
    setIsDarkMode(prevState => {
      const newState = !prevState;
      // Persist theme in localStorage
      localStorage.setItem("theme", newState ? "dark" : "light");
      // Toggle the dark class on the document root
      if (newState) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newState;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-full bg-gray-800 text-white"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <span className="text-lg">🌙</span> // Moon icon for dark mode
      ) : (
        <span className="text-lg">☀️</span> // Sun icon for light mode
      )}
    </button>
  );
};

export default ThemeToggle;
