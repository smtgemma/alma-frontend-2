"use client";
import Link from "next/link";
import React from "react";

const AdminDashboardHeader = () => {
  return (
    <div className="">
      <Link href="/">
        <div className="bg-[#9FC0FF] text-white p-6 ">
          <h1 className="text-2xl font-semibold">Bentornato</h1>
          <p className="text-[20px] font-semibold">Amministratore</p>
        </div>
      </Link>
    </div>
  );
};

export default AdminDashboardHeader;
