'use client';

import { useState, useRef, useEffect } from 'react';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function AdvancedFilterDropdown({
  filters,
  onApply,
  buttonClassName = '',
  dropdownClassName = '',
  position = 'right', // 'right' or 'left'
  initialValues = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(initialValues);
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

  // Update filter values when initialValues change
  useEffect(() => {
    setFilterValues(initialValues);
  }, [initialValues]);

  // Handle input change
  const handleInputChange = (filterId, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Handle apply filters
  const handleApply = (e) => {
    e.preventDefault();
    onApply(filterValues);
    setIsOpen(false);
  };

  // Handle reset filters
  const handleReset = () => {
    const emptyValues = {};
    filters.forEach(filter => {
      if (filter.type === 'select') {
        emptyValues[filter.id] = '';
      } else if (filter.type === 'range') {
        emptyValues[filter.id] = { min: '', max: '' };
      } else if (filter.type === 'checkbox') {
        emptyValues[filter.id] = false;
      } else if (filter.type === 'date') {
        emptyValues[filter.id] = '';
      }
    });
    setFilterValues(emptyValues);
    onApply(emptyValues);
    setIsOpen(false);
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value === '') return;
      if (value === false) return;
      if (Array.isArray(value) && value.length === 0) return;
      if (typeof value === 'object' && value !== null) {
        if (value.min || value.max) count++;
        return;
      }
      count++;
    });
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary ${buttonClassName}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {activeFilterCount > 0 ? (
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-primary mr-1" />
        ) : (
          <FunnelIcon className="h-4 w-4 text-gray-500 mr-1" />
        )}
        <span className="text-gray-700">
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${position === 'right' ? 'right-0' : 'left-0'} w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="filter-menu"
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 flex justify-between items-center">
              <span className="font-medium">Filters</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>

                  {filter.type === 'select' && (
                    <select
                      value={filterValues[filter.id] || ''}
                      onChange={(e) => handleInputChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'range' && (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder={filter.minPlaceholder || 'Min'}
                        value={filterValues[filter.id]?.min || ''}
                        onChange={(e) => handleInputChange(filter.id, {
                          ...filterValues[filter.id],
                          min: e.target.value
                        })}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      />
                      <input
                        type="number"
                        placeholder={filter.maxPlaceholder || 'Max'}
                        value={filterValues[filter.id]?.max || ''}
                        onChange={(e) => handleInputChange(filter.id, {
                          ...filterValues[filter.id],
                          max: e.target.value
                        })}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      />
                    </div>
                  )}

                  {filter.type === 'checkbox' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-${filter.id}`}
                        checked={filterValues[filter.id] || false}
                        onChange={(e) => handleInputChange(filter.id, e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-${filter.id}`} className="ml-2 block text-sm text-gray-700">
                        {filter.checkboxLabel || filter.label}
                      </label>
                    </div>
                  )}

                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={filterValues[filter.id] || ''}
                      onChange={(e) => handleInputChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-between pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
