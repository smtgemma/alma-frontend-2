import Image from 'next/image';
import React from 'react';

const HandleStrategy = () => {
    const benefits = [
        "Business-Backed Intelligence",
        "Pitch-Ready Exports",
        "Real-Time Smart Suggestions",
        "A Complete Plan in a few Minutes",
        "No Templates, No Guesswork",
        "Privacy and GDPR Compliant",
        "Regenerate, Rebuild, Reimagine",
    ];

    return (
        <section className="max-w-[1440px] mx-auto bg-white py-10 px-6 md:px-8 ">
            <h2 className=" text-[2rem] md:text-[2.3rem] font-semibold text-accent mb-12 ">
                Let AI Handle the Strategy <br />
                You Focus on the Dream
            </h2>

            <div className='flex flex-col md:flex-row items-start justify-between gap-8 mb-12'>
                <div className="flex-1 bg-white rounded-[40px]  p-6 md:p-10 " style={{ boxShadow: '0 4px 6px 1px #4F46E540' }}>
                    <div className='px-0 md:px-6'>
                        <h3 className="text-[1.7rem] md:text-[2rem] font-medium text-primary mb-4">
                            7 Key Benefits. 1 Smart Decision.
                        </h3>
                        <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
                            You get the insights of a seasoned strategist and the speed of AI without hiring a team or spending weeks in research.
                            Instead of Googling for hours, get real answers tailored to
                            your business in seconds.
                        </p>
                        <ul className=" rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
                            {benefits.map((benefit, index) => (

                                <li key={index} className="flex items-center gap-4 mb-4">
                                    <span className="bg-secondary w-7 h-7 rounded-full p-1 flex items-center justify-center">
                                        <Image
                                            src="/images/Vector.png"
                                            alt="Descriptive alt text"
                                            width={14}
                                            height={14}
                                            className="rounded-lg"
                                        />
                                    </span>
                                    <span className='text-[1rem] md:text-[1.3rem] font-medium text-accent'>{benefit}</span>


                                </li>
                            ))}
                        </ul>
                    </div>


                </div>
                <div className="flex-1 bg-white rounded-[40px] p-6 md:p-10" style={{ boxShadow: '0 4px 6px 1px #4F46E540' }}>
                    <div className=''>
                        <h3 className="text-[2rem] font-medium text-primary mb-4">
                            The whole process takes only
                            minutes of your time.
                        </h3>
                        <p className="text-[1.3rem] text-[#475466] font-normal mb-6">
                            No more staring at blank pages or outdated templates — just input your idea, and let the system do the heavy lifting.
                        </p>
                        <Image
                            src="/images/strategy.png"
                            alt="Descriptive alt text"
                            width={500}
                            height={500}
                            className="rounded-lg text-center mx-auto py-10 md:py-20"
                        />
                    </div>


                </div>
            </div>
        </section>
    );
};

export default HandleStrategy;