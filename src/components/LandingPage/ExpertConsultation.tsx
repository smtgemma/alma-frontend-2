import Image from 'next/image';
import React from 'react';

export default function ExpertConsultation() {
    return (
        <section className="max-w-[1440px] mx-auto bg-white py-10 md:py-20 px-6 md:px-8 ">
            <h2 className=" text-[1.7rem] md:text-[2.3rem] font-semibold text-accent mb-12">
                Expert’s Consultation
            </h2>

            <div className=" bg-white rounded-[40px] p-0 md:p-10 grid md:grid-cols-2 gap-6">
                <div className='p-0 md:p-12'>
                    <h3 className="text-[1.5rem] md:text-[2rem] font-medium text-primary mb-4">

                        Take One to One Experts consultations
                    </h3>
                    <p className="text-[1rem] md:text-[1.3rem]] text-[#475466] font-normal mb-6">
                        After each business plan generation get direct access to startup strategists and business planning experts who’ve helped raise millions. <br />
                        Whether you need feedback on your idea, help refining your pitch, or guidance through your plan — we’re here to guide you personally..
                    </p>
                </div>

                <div className="bg-card flex items-center justify-center mx-auto p-10 md:p-20 lg:p-24 rounded-[20px]">

                    <Image
                        src="/images/expert-img.jpg"
                        alt="My Image"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                </div>
            </div>
        </section>
    );
};