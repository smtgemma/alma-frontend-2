// components/ProblemSection.tsx
import React from 'react';
import { RxCross2 } from 'react-icons/rx';

const problems = [
  "No Clear Direction",
  "Wasted Time and Resources",
  "Investor Rejection",
  "Team Confusion",
  "Missed Opportunities",
  "Burnout and Doubt",
  "Slow Execution",
];

export default function ProblemSection() {
  return (
    <section className="max-w-[1440px] mx-auto bg-white pt-20 pb-10 px-6 md:px-8">
      <h2 className=" text-[2rem] md:text-[2.3rem] font-semibold text-accent mb-12">
        The Problem Most Founders Ignore<br />and the Smart Fix
      </h2>

      <div className=" bg-white rounded-[40px]  p-6 md:p-10 grid md:grid-cols-2 gap-6" >
        <div className='p-6 md:p-12'>
          <h3 className="text-[1.7rem] md:text-[2rem] font-medium text-accent mb-4">
            Problems Every Founder Faces Without a Proper Plan
          </h3>
          <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
            Behind every failed startup is a founder who moved forward without structure. Whether it&apos;s confusion,
            wasted resources, or missed funding — operating without a solid plan costs more than time. If you&apos;re
            building without a roadmap, you&apos;re flying blind.
          </p>
        </div>

        <ul className="bg-card p-6 md:p-12 rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-center gap-4 mb-4">
              <span className="bg-secondary rounded-full p-1"><RxCross2 className='text-primary text-lg font-extrabold' /></span>
              <span className='text-[1rem] md:text-[1.3rem] font-medium text-accent'>{problem}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
