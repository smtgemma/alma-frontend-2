import Image from 'next/image';
import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <div className='mt-3 mb-20'>
            {/* Logo */}
            <div className='flex items-center justify-center gap-2'>
                <div>
                    <Image
                        src="/images/logo.png"
                        alt="Descriptive alt text"
                        width={50}
                        height={50}
                        className="rounded-lg"
                    />
                </div>
                <div>
                    <h3 className="text-black font-medium text-2xl ">Business AI Plan</h3>
                </div>
            </div>
            <p className='text-[20px] text-[#475466] font-medium text-center py-6'>Contact us at: help@businessaiPlan.info</p>
            <div className='flex items-center justify-center gap-4 mt-4'>
                <FaFacebook className='text-blue-600 text-4xl' />
                <FaXTwitter className='text-4xl' />
                <FaInstagram className='text-pink-800 text-4xl' />
            </div>
        </div>
    );
};

export default Footer;