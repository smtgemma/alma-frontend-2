'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsCalendar2Check, BsPeople, BsSearch, BsClock } from 'react-icons/bs';

export default function SendPlanToExpert() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement API call to send invitation
      console.log('Sending invitation to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to manage users page
      router.push('/dashboard/manage-users');
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/manage-users');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
     

      {/* Add New User Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Expert's Review</h1>
        
        {/* Add New User Card */}
        <div className="bg-white rounded-[20px] shadow-md border border-gray-100 p-6 mx-0 md:mx-28">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Expert’s Email</h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
          Provide the expert’s email address to send the selected plan for review and feedback.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
