"use client";

import { useSmartForm } from './SmartFormContext';
import { getDataSummary, validateAggregatedData } from '@/utils/formDataAggregator';

export default function FormDataDemo() {
  const { getAggregatedData, logFormData, exportFormDataAsJSON } = useSmartForm();

  const handleViewAggregatedData = () => {
    const aggregated = getAggregatedData();
    console.log('🔍 Aggregated Data:', aggregated);
    
    const summary = getDataSummary(aggregated);
    console.log('📊 Data Summary:', summary);
    
    const validation = validateAggregatedData(aggregated);
    console.log('✅ Validation Results:', validation);
  };

  const handleLogFormData = () => {
    console.log('📝 Logging form data with detailed breakdown...');
    logFormData();
  };

  const handleExportJSON = () => {
    const jsonData = exportFormDataAsJSON();
    console.log('📦 Exported JSON:', jsonData);
    
    // Create downloadable file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-form-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const jsonData = exportFormDataAsJSON();
    navigator.clipboard.writeText(jsonData).then(() => {
      alert('Form data copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 min-w-[250px]">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          📊 Form Data Tools
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={handleViewAggregatedData}
            className="w-full text-left px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
          >
            🔍 View Aggregated Data
          </button>
          
          <button
            onClick={handleLogFormData}
            className="w-full text-left px-3 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded border border-green-200 transition-colors"
          >
            📝 Log Detailed Data
          </button>
          
          <button
            onClick={handleExportJSON}
            className="w-full text-left px-3 py-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 transition-colors"
          >
            📦 Export JSON File
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded border border-gray-200 transition-colors"
          >
            📋 Copy to Clipboard
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Open browser console to view detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
