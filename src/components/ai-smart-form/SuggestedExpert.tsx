import React from 'react';

const SuggestedExpert = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Suggested Expert
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered expert recommendations for your business needs
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Expert Matching System
            </h2>
            <p className="text-gray-600 mb-6">
              Our AI system analyzes your business plan and suggests the best experts 
              to help you succeed in your industry.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="w-12 h-12 bg-green-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Industry Expertise</h3>
                <p className="text-green-700 text-sm">Matched based on your specific industry and market</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Experience Level</h3>
                <p className="text-blue-700 text-sm">Experts with proven track records in similar businesses</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Network Access</h3>
                <p className="text-purple-700 text-sm">Connect with experts through our professional network</p>
              </div>
            </div>
            
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Coming Soon:</strong> AI-powered expert matching algorithm and direct consultation booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedExpert;
