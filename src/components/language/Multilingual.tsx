/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
 
export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
 
  // Create a reference to the language switcher button and dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
 
  useEffect(() => {
    // Fetch stored language from localStorage and set default language if not available
    const storedLang = localStorage.getItem("selectedLanguage");
    if (storedLang) {
      setSelectedLanguage(storedLang);
    } else {
      setSelectedLanguage("en"); // Default to English if no language is stored
    }
 
    // Set the initial googtrans cookie based on stored or default language
    if (storedLang === "en" || !storedLang) {
      document.cookie =
        "googtrans=/en/en; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
    } else {
      document.cookie = `googtrans=/en/${storedLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
    }
 
    // Close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
 
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  const handleChange = (newLang: string) => {
    if (!newLang) return;
 
    setSelectedLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);
    setIsOpen(false);
 
    if (newLang === "en") {
      document.cookie =
        "googtrans=/en/en; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
    } else {
      document.cookie = `googtrans=/en/${newLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
    }
 
    // Manually trigger the language change in Google Translate
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
    }
  };
 
  const languageNames: Record<string, string> = {
    en: "English",
    it: "Italian",
  };
 
  return (
    <div className="flex items-center gap-2 relative">
      <button
        ref={buttonRef} // Attach ref to the button
        className="w-auto h-6 md:h-auto px-3 py-1 rounded-full border-none font-bold text-black/70 bg-white flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {languageNames[selectedLanguage] || "Select a language"}
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
 
      {isOpen && (
        <div
          ref={dropdownRef} // Attach ref to the dropdown
          className="absolute top-10 -right-13 mt-1 w-full min-w-[150px] bg-white rounded-md shadow-lg z-10 border border-gray-200 "
        >
          <ul className="py-1">
            {Object.entries(languageNames).map(([code, name]) => (
              <li key={code}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer  ${
                    selectedLanguage === code ? "font-bold bg-gray-50" : ""
                  }`}
                  onClick={() => handleChange(code)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}