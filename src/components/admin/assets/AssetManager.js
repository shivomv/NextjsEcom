'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CloudinaryUploadWidget from '@/components/common/CloudinaryUploadWidget';
import AssetGrid from './AssetGrid';
import AssetFolders from './AssetFolders';
import AssetDetails from './AssetDetails';

export default function AssetManager() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch assets and folders
  useEffect(() => {
    fetchAssets();
  }, [currentFolder, sortBy]);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (currentFolder) {
        params.append('folder', currentFolder);
      }
      params.append('sort_by', sortBy);
      if (searchQuery) {
        params.append('query', searchQuery);
      }

      // Fetch assets
      const response = await fetch(`/api/admin/assets?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }

      const data = await response.json();
      setAssets(data.resources || []);
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to load assets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAssets();
  };

  // Handle folder navigation
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setSelectedAsset(null);
  };

  // Handle asset selection
  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
  };

  // Handle asset deletion
  const handleDeleteAsset = async (publicId) => {
    try {
      setIsRefreshing(true);
      
      const response = await fetch('/api/admin/assets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ public_id: publicId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      // Remove the deleted asset from the state
      setAssets(assets.filter(asset => asset.public_id !== publicId));
      
      // If the deleted asset was selected, clear the selection
      if (selectedAsset && selectedAsset.public_id === publicId) {
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      setError('Failed to delete asset. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle upload success
  const handleUploadSuccess = (result) => {
    // Add the new asset to the state
    setAssets([result, ...assets]);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchAssets();
  };

  // Create a new folder
  const handleCreateFolder = async (folderName) => {
    try {
      setIsRefreshing(true);
      
      const response = await fetch('/api/admin/assets/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          folder_name: folderName,
          parent_folder: currentFolder 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      // Refresh folders
      fetchAssets();
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Asset Manager Header */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentFolder ? `Folder: ${currentFolder.split('/').pop()}` : 'All Assets'}
            </h2>
            <button
              onClick={handleRefresh}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700"
              disabled={isLoading || isRefreshing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
            
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 ${view === 'list' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Asset Manager Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="p-4">
            <CloudinaryUploadWidget
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(error) => setError(error.message || 'Upload failed')}
              buttonText="Upload Assets"
              buttonClassName="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              options={{
                folder: currentFolder || 'my-shop',
                multiple: true
              }}
            />
            
            <div className="mt-4">
              <button
                onClick={() => {
                  const folderName = prompt('Enter folder name:');
                  if (folderName) {
                    handleCreateFolder(folderName);
                  }
                }}
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                New Folder
              </button>
            </div>
          </div>
          
          {/* Folder Navigation */}
          <AssetFolders
            folders={folders}
            currentFolder={currentFolder}
            onFolderClick={handleFolderClick}
            isLoading={isLoading}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-h-[500px] flex flex-col md:flex-row">
          {/* Asset Grid/List */}
          <div className={`flex-1 ${selectedAsset ? 'hidden md:block' : ''}`}>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : assets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No assets found</p>
                <p className="mt-1">Upload some assets or select a different folder</p>
              </div>
            ) : (
              <AssetGrid
                assets={assets}
                selectedAsset={selectedAsset}
                onAssetClick={handleAssetClick}
                onDeleteAsset={handleDeleteAsset}
                view={view}
              />
            )}
          </div>
          
          {/* Asset Details */}
          {selectedAsset && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200">
              <AssetDetails
                asset={selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onDelete={() => handleDeleteAsset(selectedAsset.public_id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
