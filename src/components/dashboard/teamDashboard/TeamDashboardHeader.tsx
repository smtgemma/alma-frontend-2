"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function TeamDashboardHeader() {
  return (
    <div className="">
      <div className="bg-[#9FC0FF] px-10 py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                Bentornato
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
