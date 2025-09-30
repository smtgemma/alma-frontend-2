/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import {
  useVerifyEmailMutation,
} from "@/redux/api/auth/authApi";
import { LuCheck } from "react-icons/lu";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";


export default function LoginSuccessful() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.user);
  const { navigateToProtected } = useProtectedNavigation();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleGeneratePlan = () => {
    // Use the improved navigation utility that handles token synchronization
    navigateToProtected("/ai-smart-form");
  };

  return (
    <div className="">
      <div className="w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#A78BFA]">
            <LuCheck className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-accent">Accesso riuscito</h1>
          <p className="text-sm text-gray-600">
            La tua password è stata aggiornata
          </p>

        </div>

        <PrimaryButton onClick={handleGeneratePlan} loading={isLoading} text="Genera un piano" />

        <Link href="/" prefetch={false}>
          <button className="px-3 py-2 w-full text-center rounded-lg bg-white border border-accent transition-all duration-300 text-accent shadow cursor-pointer">Salta</button>
        </Link>


      </div>
    </div>
  );
}
