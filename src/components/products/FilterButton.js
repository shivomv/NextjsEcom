'use client';

import { useState, useRef, useEffect } from 'react';

export default function FilterButton({ label, icon, options, active, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center px-4 py-2 rounded-full ${
          active ? 'bg-gradient-purple-pink text-white' : 'bg-white text-text hover:bg-gray-100'
        } transition-colors font-medium`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                option.value === active
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
