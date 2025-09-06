
import { AdminDashboardHeader } from '@/components/dashboard/adminDashboard';
import SendPlanToExpert from '@/components/dashboard/adminDashboard/SendPlanToExpert';
import React from 'react';

const page = () => {
    return (
        <div>
            <AdminDashboardHeader />
            <SendPlanToExpert />
        </div>
    );
};

export default page; 