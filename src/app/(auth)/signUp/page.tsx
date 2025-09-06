import SignUnPage from '@/feature/auth/SignUp';
import React from 'react';


import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
}



const page = () => {
    return (
        <div>
            <SignUnPage />
        </div>
    );
};

export default page;