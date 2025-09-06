import Image from 'next/image';
import React from 'react';

export default function ExpertConsultation() {
    return (
        <section className="max-w-[1440px] mx-auto bg-white py-20 px-6 md:px-8 ">
            <h2 className=" text-[2rem] md:text-[2.3rem] font-semibold text-accent mb-12">
                Expert’s Consultation
            </h2>

            <div className=" bg-white rounded-[40px] p-6 md:p-10 grid md:grid-cols-2 gap-6" style={{ boxShadow: '0 4px 6px 1px #4F46E540' }}>
                <div className='p-6 md:p-12'>
                    <h3 className="text-[1.7rem] md:text-[2rem] font-medium text-primary mb-4">

                        Take One to One Experts consultations
                    </h3>
                    <p className="text-[1rem] md:text-[1.3rem]] text-[#475466] font-normal mb-6">
                        After each business plan generation get direct access to startup strategists and business planning experts who’ve helped raise millions. <br />
                        Whether you need feedback on your idea, help refining your pitch, or guidance through your plan — we’re here to guide you personally..
                    </p>
                </div>

                <div className="bg-card flex items-center justify-center m-6 md:m-10 p-6 md:p-10 rounded-[20px]">

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