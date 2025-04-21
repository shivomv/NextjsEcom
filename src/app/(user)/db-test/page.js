'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DbTestPage() {
  const [dbStatus, setDbStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testDbConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/db-test');
        
        if (!response.ok) {
          throw new Error(`Failed to test database connection: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        console.error('Error testing database connection:', error);
        setError(error.message || 'An error occurred while testing database connection');
      } finally {
        setIsLoading(false);
      }
    };
    
    testDbConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : !dbStatus ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">No database status information available.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Connection Status</p>
              <p className={`mt-1 ${dbStatus.dbStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                {dbStatus.dbStatus.connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Ready State</p>
              <p className="mt-1">{dbStatus.dbStatus.readyState}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Host</p>
              <p className="mt-1">{dbStatus.dbStatus.host || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Database Name</p>
              <p className="mt-1">{dbStatus.dbStatus.name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">MongoDB URI</p>
              <p className="mt-1">{dbStatus.mongodbUri}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Collections</p>
              {dbStatus.collections && dbStatus.collections.length > 0 ? (
                <ul className="mt-1 list-disc list-inside">
                  {dbStatus.collections.map((collection) => (
                    <li key={collection} className="text-gray-700">{collection}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-gray-500">No collections found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
