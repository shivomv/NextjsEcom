'use client';

import { useState, useRef, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterDropdown({
  options,
  selectedValue,
  onChange,
  label = 'Filter',
  buttonClassName = '',
  dropdownClassName = '',
  position = 'right' // 'right' or 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  // Get the label of the currently selected option
  const getSelectedLabel = () => {
    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : 'All';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary ${buttonClassName}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FunnelIcon className="h-4 w-4 text-gray-500 mr-1" />
        <span className="text-gray-700">{getSelectedLabel()}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${position === 'right' ? 'right-0' : 'left-0'} w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="filter-menu"
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 flex justify-between items-center">
              <span className="font-medium">{label}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedValue === option.value
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
