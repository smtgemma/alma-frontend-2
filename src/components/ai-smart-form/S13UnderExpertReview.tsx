'use client';

import SmartNavbar from './SmartNavbar';
import { useSmartForm } from './SmartFormContext';
import Link from 'next/link';

export default function S13UnderExpertReview() {
    const { prevStep } = useSmartForm();

    const handleBackToHome = () => {
        console.log('Navigating back to home...');
        // Add navigation logic here
    };

    return (
        <div className='min-h-screen'>
            <SmartNavbar />
            <div className="bg-white flex flex-col items-center justify-center p-2 md:p-8 py-12">
                <div className="max-w-[1440px] mx-auto w-full bg-white p-2 md:p-8">
                    

                    {/* Form */}
                    <div className='p-4 md:p-8 relative'>
                        {/* Top Right Decorative Image */}
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48">
                            <img
                                src="/images/dotted-top.png"
                                alt="Decorative pattern"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="bg-white rounded-2xl p-4 m-2 md:p-8 md:m-8 shadow-lg relative" style={{
                            boxShadow: '0 10px 15px -3px #4F46E540, 0 4px 6px -4px #4F46E540'
                        }}>
                            <div className="space-y-8 text-center">
                                {/* Main Title */}
                                <div>
                                    <h2 className="text-[1.7rem] md:text-[2rem] text-accent font-medium mb-6">
                                        Your Business Plan is Under Expert Review
                                    </h2>
                                    <p className="text-[24px] font-medium text-info leading-relaxed max-w-4xl mx-auto">
                                        Our team is currently reviewing your generated plan to ensure it's accurate,<br />
                                        strategic, and tailored to your business goals.
                                    </p>
                                </div>

                                {/* Review Details */}
                                <div className="flex flex-col items-start space-y-4 max-w-md mx-auto">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                                        <p className="text-[1rem] text-accent">
                                            Estimated Review Time: 48 Hours
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                                        <p className="text-[1rem] text-accent">
                                            You'll be notified via email once it's ready to download
                                        </p>
                                    </div>
                                </div>

                                {/* Back to Home Button */}
                                <div className="flex justify-center mt-8">
                                    <Link href="/">
                                    <button
                                        type="button"
                                        onClick={handleBackToHome}
                                        className="px-12 py-3 bg-primary text-white text-[1rem] font-semibold rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] max-w-xs"
                                    >
                                        Back to Home
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Left Decorative Image */}
                        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 z-[-1] md:z-0">
                            <img
                                src="/images/dotted-down.png"
                                alt="Decorative pattern"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}