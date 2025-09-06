"use client";

import { GoPlus } from "react-icons/go";
import React from "react";
import Link from "next/link";

const plans = [
  {
    title: "Business Plan- InnovateX",
    subtitle: "Early stage paper company",
    status: "Completed",
    created: "05:25PM 05 July 2025",
    disabled: false,
  },
  {
    title: "Business Plan- Roto Union",
    subtitle: "Existing service holder company",
    status: "In-Completed",
    created: "05:25PM 05 July 2025",
    disabled: true,
  },
  {
    title: "Business Plan- Roto Union",
    subtitle: "Existing service holder company",
    status: "In-Completed",
    created: "05:25PM 05 July 2025",
    disabled: true,
  },
];

export default function MyPlan() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mb-6">
        <div>
          <h1 className="text-[2rem] font-medium">
            Welcome back, <span className="text-accent">Paolo</span>
          </h1>
          <p className="text-[1rem] font-regular text-info">
            Your business plans and strategic tools in one place.
          </p>
        </div>
        <Link href="ai-form">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#80E5FF] text-accent rounded-[10px] shadow cursor-pointer mt-4 md:mt-0">
            <div className="bg-white p-1 rounded-full">
              <GoPlus size={18} className="  text-accent" />
            </div>
            Generate new Plan
          </button>
        </Link>
      </div>

      <section className="">
        <h2 className="font-medium mb-4 mt-10 text-[24px]">Generated Plans</h2>
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-[20px] "
              style={{ boxShadow: "0 4px 6px 1px #00CCFF26" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b border-b-[#99A6B8]">
                <div>
                  <h3 className="font-medium text-[24px]">{plan.title}</h3>
                  <p className="text-[1rem] font-regular text-info">
                    {plan.subtitle}
                  </p>
                </div>
                <div className="text-sm text-left md:text-right">
                  <p className="text-info font-regular text-[1rem]">
                    Status: {plan.status}
                  </p>
                  <p className="text-info font-regular text-[1rem]">
                    Created: {plan.created}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-between gap-3 mt-3 w-full">
                <button className="px-4 md:px-10 py-2 bg-primary text-accent rounded-lg text-sm cursor-pointer">
                  View Plan
                </button>

                <button
                  className={`px-4 md:px-10 py-2 rounded-lg text-sm border ${
                    plan.disabled
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "border-gray-400 cursor-pointer"
                  }`}
                  disabled={plan.disabled}
                >
                  Download PDF
                </button>
                <Link href="presentation-slider">
                  <button
                    className={`px-4 md:px-10 py-2 rounded-lg text-sm border ${
                      plan.disabled
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "border-gray-400 cursor-pointer"
                    }`}
                    disabled={plan.disabled}
                  >
                    View Presentation
                  </button>
                </Link>

                <Link href="/suggested-expert">
                  <button
                    className={`px-4 md:px-10 py-2 rounded-lg text-sm border ${
                      plan.disabled
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "border-gray-400 cursor-pointer"
                    }`}
                    disabled={plan.disabled}
                  >
                    Add Expert Review
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
