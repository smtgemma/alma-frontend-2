import Link from 'next/link';
import React from 'react';
import { LuMoveUpRight } from 'react-icons/lu';

const BuildYourPlan = () => {
    return (

        <section className="max-w-[1440px] mx-auto bg-white pb-20 px-4 md:px-8 ">


            <div className="  rounded-[40px] shadow-md px-6 py-20 text-center  bg-gradient-to-tr from-[#6B4AFF] to-[#9222B7] ">

                <h3 className="text:text-[2rem] md:text-[3rem] font-normal text-[#FAFAFA] mb-4">
                    A business plan you can trust powered by <br />
                    AI, built for results.
                </h3>
                <p className="text-lg md:text-xl text-[#FAFAFA] font-normal mb-6">
                    Answer questions, let your logic build and <br />
                    get your plan.
                </p>
                <div className='flex items-center justify-center'>
                    <Link href="/ai-smart-form">
                        <button className="flex items-center gap-2 mt-6 px-6 py-3 cursor-pointer bg-white text-accent text-[1rem] md:text-[1.3rem] font-medium rounded-[52px] shadow-lg">
                            Build Your Plan now <LuMoveUpRight className='text-accent text-2xl bg-white p-1 rounded-full' />
                        </button>
                    </Link>
                </div>



            </div>
        </section>

    );
};

export default BuildYourPlan;