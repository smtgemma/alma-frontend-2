"use client";
import Link from "next/link";
import React from "react";
import { FaHandPointer } from "react-icons/fa";

const AdminPlanDetails = ({ planData }: any) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-6">
      <div className="lg:col-span-3 col-span-1 bg-white rounded-lg p-4 lg:p-6 ">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-4">
          {/* Current Plan Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <g clipPath="url(#clip0_1736_6966)">
                  <path
                    d="M25.5 17.459C25.5 16.1009 26.6193 15 28 15C29.3808 15 30.5 16.1009 30.5 17.459V25"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M30.5 20.6087C30.5 19.1679 31.6193 18 33 18C34.3808 18 35.5 19.1679 35.5 20.6087V26"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M20.5 32V8.46057C20.5 7.1016 21.6193 6 23 6C24.3808 6 25.5 7.1016 25.5 8.46057V25.8486"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M33.9 22.6324C33.9 21.3315 34.9649 20.2812 36.2646 20.3171C37.5174 20.3517 38.5 21.4184 38.5 22.6805V34.3676C38.5 36.926 36.4405 39 33.9 39H20.1C17.5595 39 15.5 36.926 15.5 34.3676V18C18.0405 18 20.1 20.074 20.1 22.6324"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M19.5497 10H1.5V1H28.5V10H24.0249"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M11.5 10V1"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1736_6966">
                    <rect
                      width="40"
                      height="40"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {planData?.count || 0}
              </p>
            </div>
          </div>

          {/* Plan Pricing Section */}
          <div className="space-y-2">
            {planData?.plans?.map((plan: any) => (
              <div key={plan.id} className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  {plan.publicName}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {plan.currency} {plan.price}
                </p>
              </div>
            )) || (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  No plans available
                </p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            )}
          </div>

          {/* Subscription Management Button */}
          <div className="pt-2">
            <Link
              href="admin/subscription-plan"
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium cursor-pointer text-center block"
            >
              Sub Management
            </Link>
          </div>
        </div>

        {/* Desktop Layout - Horizontal with vertical lines */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left Section - Current Plan */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <g clipPath="url(#clip0_1736_6966)">
                  <path
                    d="M25.5 17.459C25.5 16.1009 26.6193 15 28 15C29.3808 15 30.5 16.1009 30.5 17.459V25"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M30.5 20.6087C30.5 19.1679 31.6193 18 33 18C34.3808 18 35.5 19.1679 35.5 20.6087V26"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M20.5 32V8.46057C20.5 7.1016 21.6193 6 23 6C24.3808 6 25.5 7.1016 25.5 8.46057V25.8486"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M33.9 22.6324C33.9 21.3315 34.9649 20.2812 36.2646 20.3171C37.5174 20.3517 38.5 21.4184 38.5 22.6805V34.3676C38.5 36.926 36.4405 39 33.9 39H20.1C17.5595 39 15.5 36.926 15.5 34.3676V18C18.0405 18 20.1 20.074 20.1 22.6324"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M19.5497 10H1.5V1H28.5V10H24.0249"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M11.5 10V1"
                    stroke="#7C3AED"
                    strokeWidth="2.34375"
                    strokeMiterlimit="10"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1736_6966">
                    <rect
                      width="40"
                      height="40"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {planData?.count || 0}
              </p>
            </div>
          </div>

          {/* First Vertical Divider */}
          <div className="w-px h-16 bg-gray-200 mx-4"></div>

          {/* Middle - Plan Pricing */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            {planData?.plans?.map((plan: any) => (
              <div key={plan.id} className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-600">
                  {plan.publicName}
                </p>
                <p className="text-md md:text-lg font-semibold text-gray-900">
                  {plan.currency} {plan.price}
                </p>
              </div>
            )) || (
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-gray-600">
                  No plans available
                </p>
                <p className="text-lg font-semibold text-gray-900">-</p>
              </div>
            )}
          </div>

          {/* Second Vertical Divider */}
          <div className="w-px h-16 bg-gray-200 mx-4"></div>

          {/* Right side - Subscription Management Button */}
          <div>
            <Link
              href="admin/subscription-plan"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium cursor-pointer"
            >
              Subscriptions Management
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="col-span-1"></div> */}
    </div>
  );
};

export default AdminPlanDetails;
