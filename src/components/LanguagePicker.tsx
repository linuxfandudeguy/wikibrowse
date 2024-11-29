import React from "react";

interface LanguagePickerProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ language, setLanguage }) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "zh", label: "中文 (Chinese)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "ar", label: "العربية (Arabic)" },
    { code: "pt", label: "Português (Portuguese)" },
    { code: "bn", label: "বাংলা (Bengali)" },
    { code: "ru", label: "Русский (Russian)" },
    { code: "ja", label: "日本語 (Japanese)" },
    { code: "de", label: "Deutsch (German)" },
    { code: "ko", label: "한국어 (Korean)" },
    { code: "fr", label: "Français (French)" },
    { code: "it", label: "Italiano (Italian)" },
    { code: "pl", label: "Polski (Polish)" },
    { code: "uk", label: "Українська (Ukrainian)" },
    { code: "ro", label: "Română (Romanian)" },
    { code: "tr", label: "Türkçe (Turkish)" },
    { code: "fa", label: "فارسی (Persian)" },
    { code: "sv", label: "Svenska (Swedish)" },
    { code: "fi", label: "Suomi (Finnish)" },
  ];

  return (
    <div className="flex items-center space-x-2 text-white">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg border focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguagePicker;
