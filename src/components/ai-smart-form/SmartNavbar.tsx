import Link from "next/link";
import React from "react";

type SmartNavbarProps = {
  rightButtons?: React.ReactNode;
};

const SmartNavbar: React.FC<SmartNavbarProps> = ({ rightButtons }) => {
  return (
    <nav className="w-full  py-4 border-b-[0.5px] border-b-[#99A6B8]">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Business AI Plan Logo"
              width={50}
              height={50}
              className="rounded-lg"
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = "none";
              }}
            />
            <h3 className="text-black font-medium text-2xl">
              Business AI Plan
            </h3>
          </div>
        </Link>

        {/* Dynamic Buttons */}
        <div className="flex gap-4">{rightButtons}</div>
      </div>
    </nav>
  );
};

export default SmartNavbar;
