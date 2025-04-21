'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AssetDetails({ asset, onClose, onDelete }) {
  const [copied, setCopied] = useState(false);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file extension
  const getFileExtension = (url) => {
    return url.split('.').pop().toLowerCase();
  };

  // Check if asset is an image
  const isImage = (asset) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(getFileExtension(asset.url));
  };

  // Copy URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get file name from public_id
  const getFileName = (publicId) => {
    return publicId.split('/').pop();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Asset Details</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Preview */}
        <div className="mb-6">
          <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
            {isImage(asset) ? (
              <Image
                src={asset.url}
                alt={getFileName(asset.public_id)}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-400">
                    {getFileExtension(asset.url).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {formatFileSize(asset.bytes)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* File Info */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">File Name</h4>
            <p className="mt-1 text-sm text-gray-900 break-all">
              {getFileName(asset.public_id)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Public ID</h4>
            <p className="mt-1 text-sm text-gray-900 break-all">
              {asset.public_id}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">URL</h4>
            <div className="mt-1 flex items-center">
              <input
                type="text"
                value={asset.url}
                readOnly
                className="block w-full text-sm text-gray-900 border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button
                onClick={() => copyToClipboard(asset.url)}
                className="ml-2 p-1 text-gray-500 hover:text-primary"
                title={copied ? 'Copied!' : 'Copy URL'}
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <p className="mt-1 text-sm text-gray-900">
                {getFileExtension(asset.url).toUpperCase()}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Size</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatFileSize(asset.bytes)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Dimensions</h4>
              <p className="mt-1 text-sm text-gray-900">
                {asset.width && asset.height ? `${asset.width} × ${asset.height}` : 'N/A'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(asset.created_at)}
              </p>
            </div>
          </div>
          
          {/* Image Transformations (for images only) */}
          {isImage(asset) && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Transformations</h4>
              
              <div className="space-y-2">
                <div>
                  <h5 className="text-xs font-medium text-gray-500">Thumbnail (100x100)</h5>
                  <div className="mt-1 flex items-center">
                    <input
                      type="text"
                      value={asset.url.replace('/upload/', '/upload/c_thumb,h_100,w_100/')}
                      readOnly
                      className="block w-full text-sm text-gray-900 border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={() => copyToClipboard(asset.url.replace('/upload/', '/upload/c_thumb,h_100,w_100/'))}
                      className="ml-2 p-1 text-gray-500 hover:text-primary"
                      title="Copy URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-gray-500">Responsive (w_auto)</h5>
                  <div className="mt-1 flex items-center">
                    <input
                      type="text"
                      value={asset.url.replace('/upload/', '/upload/w_auto,c_scale/')}
                      readOnly
                      className="block w-full text-sm text-gray-900 border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={() => copyToClipboard(asset.url.replace('/upload/', '/upload/w_auto,c_scale/'))}
                      className="ml-2 p-1 text-gray-500 hover:text-primary"
                      title="Copy URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(asset.url, '_blank')}
            className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </button>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this asset?')) {
                onDelete();
              }
            }}
            className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
