import OtpVerification from '@/feature/auth/Otp';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OTP',
}


const page = () => {
    return (
        <div>
            <OtpVerification />
        </div>
    );
};

export default page;