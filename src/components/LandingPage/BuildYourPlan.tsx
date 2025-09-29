import Link from "next/link";
import React from "react";
import { LuMoveUpRight } from "react-icons/lu";
import ProtectedLink from "@/components/ProtectedLink";

const BuildYourPlan = () => {
  return (
    <section className="max-w-[1440px] mx-auto bg-white pb-20 px-4 md:px-8 ">
      <div className="  rounded-[40px] shadow-md px-6 py-20 text-center  bg-gradient-to-tr from-[#6B4AFF] to-[#9222B7] ">
        <h3 className="text-[2rem] md:text-[3rem] font-normal text-[#FAFAFA] mb-4">
          Un piano aziendale di cui puoi fidarti alimentato da <br />
          IA, costruito per i risultati.
        </h3>
        <p className="text-lg md:text-xl text-[#FAFAFA] font-normal mb-6">
          Rispondi alle domande, lascia che la tua logica si costruisca e <br />
          ottieni il tuo piano.
        </p>
        <div className="flex items-center justify-center">
          <ProtectedLink href="/ai-smart-form">
            <button className="flex items-center gap-2 mt-6 px-6 py-3 cursor-pointer bg-white text-accent text-[1rem] md:text-[1.3rem] font-medium rounded-[52px] shadow-lg">
              Crea il Tuo Piano Ora{" "}
              <LuMoveUpRight className="text-accent text-2xl bg-white p-1 rounded-full" />
            </button>
          </ProtectedLink>
        </div>
      </div>
    </section>
  );
};

export default BuildYourPlan;
