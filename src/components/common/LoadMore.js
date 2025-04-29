'use client';

import { useState } from 'react';

export default function LoadMore({ 
  initialLimit = 10, 
  increment = 10, 
  totalItems = 0, 
  onLoadMore,
  isLoading = false
}) {
  const [limit, setLimit] = useState(initialLimit);
  
  const handleLoadMore = () => {
    const newLimit = limit + increment;
    setLimit(newLimit);
    if (onLoadMore) {
      onLoadMore(newLimit);
    }
  };

  const hasMore = totalItems > limit;

  return (
    <div className="w-full flex justify-center mt-8 mb-4">
      {hasMore ? (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              Load More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      ) : (
        totalItems > 0 && (
          <p className="text-gray-500 text-sm">
            Showing all {totalItems} products
          </p>
        )
      )}
    </div>
  );
}
