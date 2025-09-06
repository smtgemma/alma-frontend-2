"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function TeamDashboardHeader() {
  return (
    // <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-12">
    //   <div className="bg-[#9FC0FF] px-8 py-4">
    //     <div className="flex items-center justify-between">
    //     <Link href="/">
    //         <div>
    //           <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
    //         </div>
    //       </Link>

    //     </div>
    //   </div>
    // </div>
    <div className="">
      <div className="bg-[#9FC0FF] px-10 py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-white">Welcome Back</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
     
  );
}
