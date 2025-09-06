'use client';

import { useState } from 'react';

export default function BillingPlan() {
    // Form state
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        country: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        additionalInfo: ''
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        nameOnCard: '',
        billingCountry: '',
        zipCode: ''
    });

    const handleBillingChange = (field: string, value: string) => {
        setBillingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentChange = (field: string, value: string) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSubscribe = () => {
        console.log('Processing subscription...', { billingInfo, paymentInfo });
        // Add your subscription logic here
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className="bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 py-12">
                <div className="max-w-[1440px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-2 px-8">
                        <h1 className="text-[1.7rem] md:text-[2.3rem] text-accent font-medium">
                            Billing Information
                        </h1>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2">
                        {/* Billing Information Section */}
                        <div className="rounded-2xl p-8">
                            <div className="space-y-4">
                                {/* Name Fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="question-text">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={billingInfo.firstName}
                                            onChange={(e) => handleBillingChange('firstName', e.target.value)}
                                            placeholder="Paolo"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                    <div>
                                        <label className="question-text">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={billingInfo.lastName}
                                            onChange={(e) => handleBillingChange('lastName', e.target.value)}
                                            placeholder="Maldini"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="question-text">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={billingInfo.phone}
                                            onChange={(e) => handleBillingChange('phone', e.target.value)}
                                            placeholder="+391026476"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                    <div>
                                        <label className="question-text">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={billingInfo.email}
                                            onChange={(e) => handleBillingChange('email', e.target.value)}
                                            placeholder="paolomaldini003@gmail.com"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                </div>

                                {/* Country/Region */}
                                <div>
                                    <label className="question-text">
                                        Country/Region
                                    </label>
                                    <input
                                        type="text"
                                        value={billingInfo.country}
                                        onChange={(e) => handleBillingChange('country', e.target.value)}
                                        placeholder="Italy"
                                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="question-text">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={billingInfo.address}
                                        onChange={(e) => handleBillingChange('address', e.target.value)}
                                        placeholder="Roma,Italia"
                                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                    />
                                </div>

                                {/* Address Details */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={billingInfo.city}
                                            onChange={(e) => handleBillingChange('city', e.target.value)}
                                            placeholder="3891 Ranchview"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={billingInfo.state}
                                            onChange={(e) => handleBillingChange('state', e.target.value)}
                                            placeholder="Ranchview"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={billingInfo.zipCode}
                                            onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                                            placeholder="Ranchview"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <label className="question-text">
                                        Additional Information
                                    </label>
                                    <textarea
                                        value={billingInfo.additionalInfo}
                                        onChange={(e) => handleBillingChange('additionalInfo', e.target.value)}
                                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem] resize-none"
                                    />
                                </div>

                                {/* Security Notice */}
                                <p className="text-[1rem] text-info font-medium mt-4">
                                    Your billing information is securely stored and encrypted.
                                </p>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="rounded-2xl p-8">
                            <h2 className="text-[2rem] font-medium text-accent mb-6 mt-5">
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                {/* Card Information */}
                                <div>
                                    <div>
                                        <label className="question-text">
                                            Card Information
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={paymentInfo.cardNumber}
                                                onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                                                placeholder="4242 5859 5684 2585"
                                                className="w-full px-4 py-3 border border-[#888888]/50 rounded-t-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem] pr-16"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                                                <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                                <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                                                <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry and CVC */}
                                    <div className="grid grid-cols-2">
                                        <div>
                                            <input
                                                type="text"
                                                value={paymentInfo.expiryDate}
                                                onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-[#888888]/50 rounded-bl-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={paymentInfo.cvc}
                                                onChange={(e) => handlePaymentChange('cvc', e.target.value)}
                                                placeholder="CVC"
                                                className="w-full px-4 py-3 border border-[#888888]/50 rounded-br-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Name on Card */}
                                <div>
                                    <label className="question-text">
                                        Name On Card
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentInfo.nameOnCard}
                                        onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                                        placeholder="3891 Ranchview Dr. Richardson, California 62639"
                                        className="w-full px-4 py-3 border border-[#888888]/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                    />
                                </div>

                                {/* Country and Zip */}
                                <div>
                                    <div>
                                        <label className="question-text">
                                            Country or region
                                        </label>
                                        <select
                                            value={paymentInfo.billingCountry}
                                            onChange={(e) => handlePaymentChange('billingCountry', e.target.value)}
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-t-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 text-[0.9rem] bg-white"
                                        >
                                            <option value="">Select country</option>
                                            <option value="US">United States</option>
                                            <option value="IT">Italy</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="DE">Germany</option>
                                            <option value="FR">France</option>
                                        </select>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            value={paymentInfo.zipCode}
                                            onChange={(e) => handlePaymentChange('zipCode', e.target.value)}
                                            placeholder="10001"
                                            className="w-full px-4 py-3 border border-[#888888]/50 rounded-b-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-[0.9rem]"
                                        />
                                    </div>
                                </div>

                                {/* Subscribe Button */}
                                <button
                                    onClick={handleSubscribe}
                                    className="w-full px-8 py-3 cursor-pointer bg-primary text-white text-[1rem] font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:bg-primary/90 mt-8"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}