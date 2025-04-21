'use client';

import { useState, useEffect } from 'react';

export default function CloudinaryStatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cloudinary-test');
        
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Error checking Cloudinary status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cloudinary Status</h1>
      
      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Checking Cloudinary status...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cloudinary Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Cloud Name</p>
              <p className="mt-1">{status.cloudName}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">API Key</p>
              <p className="mt-1">{status.apiKey}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">API Secret</p>
              <p className="mt-1">{status.apiSecret}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Connection Status</p>
              <p className={`mt-1 ${status.connection === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
                {status.connection}
              </p>
            </div>
            
            {status.pingResult && (
              <div>
                <p className="text-sm font-medium text-gray-500">Ping Result</p>
                <pre className="mt-1 bg-gray-100 p-2 rounded overflow-auto text-sm">
                  {JSON.stringify(status.pingResult, null, 2)}
                </pre>
              </div>
            )}
            
            {status.error && (
              <div>
                <p className="text-sm font-medium text-gray-500">Error</p>
                <p className="mt-1 text-red-600">{status.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
