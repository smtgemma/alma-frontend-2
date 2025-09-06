export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Main Loading Animation */}
      <div className="relative mb-8">
        {/* Outer Ring - Business Plan Theme */}
        <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Center Icon - Document/Plan Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Preparing Your Dashboard</h3>
        <p className="text-gray-600 max-w-md">Gathering your business plans and analytics...</p>
      </div>

      {/* Progress Indicators */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Loading Steps */}
      <div className="mt-8 space-y-2 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Loading your profile</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Fetching business plans</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span>Calculating statistics</span>
        </div>
      </div>
    </div>
  );
}