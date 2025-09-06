"use client";
import Link from "next/link";
import React from "react";
import { FaHandPointer } from "react-icons/fa";

const AdminPlanDetails = ({ planData }: any) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-6">
      <div className="lg:col-span-3 col-span-1 bg-white rounded-lg p-4 lg:p-6 shadow-sm">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-4">
          {/* Current Plan Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <FaHandPointer className="text-primary w-6 h-6" />
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
              <FaHandPointer className="text-primary w-6 h-6" />
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
