import { 
  getRefreshToken, 
  getAccessToken,
  setAccessToken, 
  setRefreshToken, 
  clearAuthData 
} from './cookieManager';

// Track if we're currently refreshing to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: any) => void;
}> = [];

// Store reference to dispatch function to avoid circular dependency
let storeDispatch: any = null;
let userActions: any = null;

// Initialize function to set the dispatch and actions from outside
export const initializeTokenRefresh = (dispatch: any, actions: any) => {
  storeDispatch = dispatch;
  userActions = actions;
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  // Get refresh token using our cookie manager utility
  const refreshToken = getRefreshToken();

  // If no refresh token, logout immediately
  if (!refreshToken) {
    if (storeDispatch && userActions) {
      storeDispatch(userActions.logout());
    }
    return null;
  }

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  if (storeDispatch && userActions) {
    storeDispatch(userActions.setRefreshingToken(true));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      // Update tokens in Redux store
      if (storeDispatch && userActions) {
        storeDispatch(userActions.updateTokens({
          accessToken,
          refreshToken: newRefreshToken || refreshToken, // Use new refresh token if provided, otherwise keep the old one
        }));
      }

      // Update localStorage and cookies with persistent settings
      setAccessToken(accessToken);

      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      processQueue(null, accessToken);
      return accessToken;
    } else {
      // Refresh failed, logout user
      console.error('Token refresh failed:', data.message);
      
      // Clean up storage using our utility
      clearAuthData();
      
      if (storeDispatch && userActions) {
        storeDispatch(userActions.logout());
      }
      processQueue(new Error('Token refresh failed'), null);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/signIn';
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Clean up storage using our utility
    clearAuthData();
    
    if (storeDispatch && userActions) {
      storeDispatch(userActions.logout());
    }
    processQueue(error, null);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/signIn';
    }
    
    return null;
  } finally {
    isRefreshing = false;
    if (storeDispatch && userActions) {
      storeDispatch(userActions.setRefreshingToken(false));
    }
  }
};

// Utility function to check if token is expired or will expire soon (within 5 minutes)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    // Check if token expires in less than 5 minutes (300 seconds)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Treat as expired if we can't parse it
  }
};

// Utility function to get a valid access token (refreshes if needed)
export const getValidAccessToken = async (): Promise<string | null> => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  // If token is expired or will expire soon, refresh it
  if (isTokenExpired(token)) {
    return await refreshAccessToken();
  }

  return token;
};
