"use client";

import Image from "next/image";
import Link from "next/link";

export default function SoloDashboardHeader() {
  return (
    <div className=" md:mt-0 ">
      <Link href="/">
        <div className="bg-[#9FC0FF] text-white p-6 ">
          <h1 className="text-2xl font-semibold">Bentornato</h1>
          {/* <p className="text-[20px] font-semibold">Admin</p> */}
        </div>
      </Link>
    </div>
  );
}
