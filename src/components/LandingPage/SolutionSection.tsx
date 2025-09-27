// components/SolutionSection.tsx
import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const benefits = [
  "Roadmap Chiara in Avanti",
  "Uso Più Intelligente di Tempo e Risorse",
  "Documentazione Pronta per Investitori",
  "Team Allineato e Motivato",
  "Opportunità che Emergono Chiaramente",
  "Flusso di Lavoro Automatizzato",
  "Tranquillità per il Viaggio",
];

export default function SolutionSection() {
  return (
    <section className="max-w-[1440px] mx-auto bg-white px-6 md:px-8  pb-10">
      <div className=" bg-white rounded-[40px]  p-0 md:p-10 grid md:grid-cols-2 gap-6">
        {" "}
        {/* style={{ boxShadow: '0 4px 6px 1px #4F46E540' }} */}
        <ul className="bg-card p-6 md:p-12 rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
          {benefits.map((problem, index) => (
            <li key={index} className="flex items-center gap-4 mb-4">
              <span className="bg-secondary rounded-full p-1">
                <FaCheck className="text-primary text-md md:text-lg font-normal" />
              </span>
              <span className="text-[1rem] md:text-[1.3rem] font-medium text-accent">
                {problem}
              </span>
            </li>
          ))}
        </ul>
        <div className="p-0 md:p-12">
          <h3 className="text-[1.5rem] md:text-[2rem] font-medium text-accent mb-4">
            Vantaggi Rivoluzionari di Avere un Piano Chiaro
          </h3>
          <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
            Quando porti chiarezza alla tua visione, segue lo slancio. Un piano
            ben strutturato non organizza solo i tuoi pensieri — riduce la
            confusione interna, rafforza l&apos;allineamento e costruisce
            fiducia in ogni decisione. La nostra IA lo rende possibile in pochi
            minuti: nessuna supposizione, nessun esaurimento.
          </p>
        </div>
      </div>
    </section>
  );
}
