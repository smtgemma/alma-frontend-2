/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { LuLoader } from "react-icons/lu";

const PrimaryButton = ({
  text,
  onClick,
  children,
  loading = false,
  type,
}: {
  text?: string;
  loading?: boolean;
  onClick?: any;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}) => {
  return children ? (
    <div
      onClick={onClick}
      className="px-2 cursor-pointer text-center py-2 rounded-full bg-primary/80 transition-all duration-300 text-white hover:bg-primary shadow"
    >
      {children}
    </div>
  ) : (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className="px-3 py-2 w-full text-center rounded-lg bg-primary/80 transition-all duration-300 text-white hover:bg-primary shadow cursor-pointer"
    >
      <div className={`flex items-center justify-center gap-2`}>
        <LuLoader
          className={`${
            loading ? "opacity-100" : "opacity-0"
          } animate-spin text-center absolute`}
        />
        <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
          {text}
        </span>
      </div>
    </button>
  );
};

export default PrimaryButton;
