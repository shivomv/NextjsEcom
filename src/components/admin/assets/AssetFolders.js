'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AssetFolders({ folders, currentFolder, onFolderClick, isLoading }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  // Toggle folder expansion
  const toggleFolder = (folder) => {
    setExpandedFolders({
      ...expandedFolders,
      [folder]: !expandedFolders[folder]
    });
  };

  // Get folder name from path
  const getFolderName = (folder) => {
    return folder.split('/').pop();
  };

  // Get parent folder path
  const getParentFolder = (folder) => {
    const parts = folder.split('/');
    parts.pop();
    return parts.join('/');
  };

  // Group folders by parent
  const groupFoldersByParent = () => {
    const grouped = {};
    
    folders.forEach(folder => {
      const parts = folder.split('/');
      
      if (parts.length === 1) {
        // Top-level folder
        if (!grouped['']) {
          grouped[''] = [];
        }
        grouped[''].push(folder);
      } else {
        // Nested folder
        const parent = parts.slice(0, -1).join('/');
        if (!grouped[parent]) {
          grouped[parent] = [];
        }
        grouped[parent].push(folder);
      }
    });
    
    return grouped;
  };

  // Render folder tree
  const renderFolderTree = (parentFolder = '') => {
    const groupedFolders = groupFoldersByParent();
    const childFolders = groupedFolders[parentFolder] || [];
    
    if (childFolders.length === 0) {
      return null;
    }
    
    return (
      <ul className={`space-y-1 ${parentFolder ? 'ml-4 mt-1' : ''}`}>
        {childFolders.map(folder => (
          <li key={folder}>
            <div className="flex items-center">
              {groupedFolders[folder] && groupedFolders[folder].length > 0 ? (
                <button
                  onClick={() => toggleFolder(folder)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${expandedFolders[folder] ? 'transform rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <div className="w-6"></div>
              )}
              
              <button
                onClick={() => onFolderClick(folder)}
                className={`flex items-center py-1 px-2 rounded-md text-sm ${
                  currentFolder === folder
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                {getFolderName(folder)}
              </button>
            </div>
            
            {expandedFolders[folder] && renderFolderTree(folder)}
          </li>
        ))}
      </ul>
    );
  };

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    if (!currentFolder) return null;
    
    const parts = currentFolder.split('/');
    const breadcrumbs = [];
    
    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join('/');
      breadcrumbs.push({
        name: parts[i],
        path: path
      });
    }
    
    return (
      <div className="flex items-center text-sm text-gray-600 mb-2 px-4 py-2 bg-gray-50 overflow-x-auto">
        <button
          onClick={() => onFolderClick('')}
          className="hover:text-primary"
        >
          Root
        </button>
        
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            
            <button
              onClick={() => onFolderClick(crumb.path)}
              className={`hover:text-primary ${index === breadcrumbs.length - 1 ? 'font-medium text-primary' : ''}`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200">
      {currentFolder && renderBreadcrumbs()}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Folders</h3>
          
          {isLoading && (
            <LoadingSpinner size="sm" />
          )}
        </div>
        
        <div>
          <button
            onClick={() => onFolderClick('')}
            className={`flex items-center py-1 px-2 rounded-md text-sm w-full ${
              currentFolder === ''
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            All Assets
          </button>
        </div>
        
        {folders.length > 0 ? (
          <div className="mt-2">
            {renderFolderTree()}
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-2 text-center py-4">
            No folders found
          </div>
        )}
      </div>
    </div>
  );
}
