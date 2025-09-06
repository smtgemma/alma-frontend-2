/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import {
  useVerifyEmailMutation,
} from "@/redux/api/auth/authApi";
import { LuCheck } from "react-icons/lu";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Link from "next/link";


export default function ResetSuccessful() {



  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  

  return (
    <div className="">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4 flex flex-col items-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#A78BFA]">
            <LuCheck className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-accent">Password Reset Successful </h1>
          <p className="text-sm text-gray-600">
            Your password has been updated
          </p>

        </div>

        


          
      <Link href="/">
        <PrimaryButton type="submit" loading={isLoading} text="Continue" />
      </Link>


      </div>
    </div>
  );
}
