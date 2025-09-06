import SignInPage from "@/feature/auth/SignIn";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const page = () => {
  return (
    <div>
      <SignInPage />
    </div>
  );
};

export default page;
