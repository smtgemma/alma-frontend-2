"use client"
import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import { persistor, store } from './store';
import { PersistGate } from "redux-persist/integration/react";
import AuthInitializer from '@/components/AuthInitializer';
import { initializeTokenRefresh } from '@/utils/tokenRefresh';
import { setRefreshingToken, updateTokens, logout } from '@/redux/features/user/userSlice';

// Component to initialize token refresh after store is available
const TokenRefreshInitializer = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Initialize token refresh with store dispatch and actions
        initializeTokenRefresh(store.dispatch, {
            setRefreshingToken,
            updateTokens,
            logout
        });
    }, []);

    return <>{children}</>;
};

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <TokenRefreshInitializer>
                    <AuthInitializer>
                        {children}
                    </AuthInitializer>
                </TokenRefreshInitializer>
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;
