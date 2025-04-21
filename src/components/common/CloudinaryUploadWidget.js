'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  onUploadError,
  buttonText = 'Upload Image',
  buttonClassName = '',
  options = {},
  multiple = false
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    // If the Cloudinary script is already loaded
    if (typeof window !== 'undefined' && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      setLoaded(true);
      initializeWidget();
    }
  }, [loaded]);

  const initializeWidget = () => {
    if (!cloudinaryRef.current) return;

    // Default options
    const defaultOptions = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      folder: 'my-shop',
      multiple: multiple,
      resourceType: 'image',
      maxImageFileSize: 5000000, // 5MB
      sources: ['local', 'url', 'camera'],
      styles: {
        palette: {
          window: '#FFFFFF',
          windowBorder: '#90A0B3',
          tabIcon: '#6602C2',
          menuIcons: '#6602C2',
          textDark: '#000000',
          textLight: '#FFFFFF',
          link: '#6602C2',
          action: '#BA05BE',
          inactiveTabIcon: '#606060',
          error: '#F44235',
          inProgress: '#6602C2',
          complete: '#20B832',
          sourceBg: '#F4F4F5'
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
            active: true
          }
        }
      }
    };

    // Merge default options with user options
    const mergedOptions = { ...defaultOptions, ...options };

    // Create the widget
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      mergedOptions,
      (error, result) => {
        if (error) {
          setError(error);
          if (onUploadError) onUploadError(error);
          setIsUploading(false);
          return;
        }

        if (result.event === 'success') {
          if (onUploadSuccess) onUploadSuccess(result.info);
        }

        if (result.event === 'queues-start') {
          setIsUploading(true);
        }

        if (result.event === 'queues-end') {
          setIsUploading(false);
        }

        if (result.event === 'close') {
          setIsUploading(false);
        }
      }
    );
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    } else if (loaded) {
      initializeWidget();
      setTimeout(() => {
        if (widgetRef.current) widgetRef.current.open();
      }, 100);
    } else {
      setError('Cloudinary widget is not loaded yet');
    }
  };

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => {
          cloudinaryRef.current = window.cloudinary;
          setLoaded(true);
          initializeWidget();
        }}
        onError={() => {
          setError('Failed to load Cloudinary widget');
          if (onUploadError) onUploadError('Failed to load Cloudinary widget');
        }}
      />
      <button
        onClick={handleClick}
        disabled={!loaded || isUploading}
        className={`${buttonClassName} ${!loaded || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="button"
      >
        {isUploading ? 'Uploading...' : buttonText}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error.message || error}</p>}
    </>
  );
}
