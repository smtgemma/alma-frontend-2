'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // you can use any icon or SVG you prefer

const faqs = [
    {
        question: "How long does it take to generate a full business plan?",
        answer:
            "Less than 10 minutes. Simply answer a few guided prompts, and our AI instantly generates a structured, investor-ready business plan — complete with executive summary, market analysis, strategy, and projections.",
    },
    {
        question: "Do I need any business experience to use this tool?",
        answer: "Less than 10 minutes. Simply answer a few guided prompts, and our AI instantly generates a structured, investor-ready business plan — complete with executive summary, market analysis, strategy, and projections.",
    },
    {
        question: "Can I export or share my business plan?",
        answer: "Less than 10 minutes. Simply answer a few guided prompts, and our AI instantly generates a structured, investor-ready business plan — complete with executive summary, market analysis, strategy, and projections.",
    },
    {
        question: "Is my data secure and private?",
        answer: "Less than 10 minutes. Simply answer a few guided prompts, and our AI instantly generates a structured, investor-ready business plan — complete with executive summary, market analysis, strategy, and projections.",
    },
    {
        question: "What if I need to update or revise my plan later?",
        answer: "Less than 10 minutes. Simply answer a few guided prompts, and our AI instantly generates a structured, investor-ready business plan — complete with executive summary, market analysis, strategy, and projections.",
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="max-w-[1440px] mx-auto bg-white py-20 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Left Side */}
                <div className="md:w-1/2">
                    <h2 className="text-primary text-[1.7rem] md:text-[2rem] font-semibold mb-2">Frequently<br /><span className=''>Asked Questions?</span></h2>

                    <p className="text-[#475466] text-[16px] md:text-xl font-semibold ">Got questions? We've answered the most common ones.</p>
                </div>

                {/* Right Side */}
                <div className="md:w-1/2 space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={` p-4 ${openIndex === index ? 'bg-card rounded-md ' : ''}`}
                        >


                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between text-left text-gray-800 text-sm md:text-xl font-semibold focus:outline-none cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300  ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                    <span>{faq.question}</span>
                                </div>
                            </button>
                            

                            {openIndex === index && faq.answer && (
                                <p className="mt-3 ps-7 text-gray-500 text-sm md:text-base leading-relaxed">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
