import React from 'react';

const PresentationSlider = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Presentation Slider
          </h1>
          <p className="text-xl text-gray-600">
            Interactive presentation component for your business plans
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Component Under Development
            </h2>
            <p className="text-gray-600 mb-6">
              This presentation slider component is currently being developed. 
              It will provide an interactive way to showcase your business plans.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Coming Soon:</strong> Interactive slides, animations, and presentation controls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationSlider;
