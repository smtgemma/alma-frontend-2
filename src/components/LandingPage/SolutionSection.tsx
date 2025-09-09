// components/SolutionSection.tsx
import Image from 'next/image';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const benefits = [
  "Clear Roadmap Forward",
  "Smarter Use of Time & Resources",
  "Investor-Ready Documentation",
  "Aligned, Motivated Team",
  "Opportunities Surface Clearly",
  "Automated Workflow",
  "Peace of Mind for the Journey",
];

export default function SolutionSection() {
  return (
    <section className="max-w-[1440px] mx-auto bg-white px-6 md:px-8  pb-10">
      

      <div className=" bg-white rounded-[40px]  p-6 md:p-10 grid md:grid-cols-2 gap-6" > {/* style={{ boxShadow: '0 4px 6px 1px #4F46E540' }} */}
       

        <ul className="bg-card p-6 md:p-12 rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
          {benefits.map((problem, index) => (
            <li key={index} className="flex items-center gap-4 mb-4">
              <span className="bg-secondary rounded-full p-1"><FaCheck className='text-primary text-lg font-normal' /></span>
              <span className='text-[1rem] md:text-[1.3rem] font-medium text-accent'>{problem}</span>
            </li>
          ))}
        </ul>

        <div className='p-6 md:p-12'>
        <h3 className="text-[1.7rem] md:text-[2rem] font-medium text-accent mb-4">
            Game-Changing Benefits of Having a Clear Plan
          </h3>
          <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
            When you bring clarity to your vision, momentum follows. A well-structured plan doesn’t just organize your
            thoughts — it reduces internal confusion, strengthens alignment, and builds confidence in every decision.
            Our AI makes that possible in just minutes: no guesswork, no burnout.
          </p>
        </div>
      </div>
    </section>
  );
};
