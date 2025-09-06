import ResetPasswordPage from '@/feature/auth/ResetPassword';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password',
}


const page = () => {
    return (
        <div>
            <ResetPasswordPage />
        </div>
    );
};

export default page;