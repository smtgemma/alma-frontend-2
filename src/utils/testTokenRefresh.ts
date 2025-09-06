// Test utility to verify token refresh functionality
// This can be removed after testing

import { isTokenExpired, getValidAccessToken } from './tokenRefresh';

export const testTokenRefreshFunctionality = () => {
  console.log('=== Token Refresh Test Results ===');
  
  // Test 1: Token expiration check with a mock token
  const mockValidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lly5TTWY7k4K7x8v8JvPjaxLRHV4KuEuVw_YgpnfgM8'; // expires in far future
  const mockExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KU'; // expired
  
  console.log('Valid token expired?', isTokenExpired(mockValidToken));
  console.log('Expired token expired?', isTokenExpired(mockExpiredToken));
  
  // Test 2: Check if functions are available
  console.log('getValidAccessToken available?', typeof getValidAccessToken === 'function');
  
  console.log('=== End Token Refresh Tests ===');
  
  return {
    isTokenExpired,
    getValidAccessToken,
    validTokenExpired: isTokenExpired(mockValidToken),
    expiredTokenExpired: isTokenExpired(mockExpiredToken)
  };
};

// Auto-run test in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run test after a short delay to ensure everything is initialized
  setTimeout(() => {
    testTokenRefreshFunctionality();
  }, 1000);
}
