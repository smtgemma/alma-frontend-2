// components/ProblemSection.tsx
import React from "react";
import { RxCross2 } from "react-icons/rx";

const problems = [
  "Nessuna Direzione Chiara",
  "Tempo e Risorse Sprecati",
  "Rifiuto degli Investitori",
  "Confusione del Team",
  "Opportunità Mancate",
  "Esaurimento e Dubbi",
  "Esecuzione Lenta",
];

export default function ProblemSection() {
  return (
    <section className="max-w-[1440px] mx-auto bg-white pt-20 pb-10 px-6 md:px-8">
      <h2 className=" text-[1.7rem] md:text-[2.3rem] font-semibold text-accent mb-12">
        Il Problema che la Maggior Parte dei Fondatori Ignora
        <br />e la Soluzione Intelligente
      </h2>

      <div className=" bg-white rounded-[40px]  p-0 md:p-10 grid md:grid-cols-2 gap-6">
        <div className="p-0 md:p-12">
          <h3 className="text-[1.3rem] md:text-[2rem] font-medium text-accent mb-4">
            Problemi che Ogni Fondatore Affronta Senza un Piano Appropriato
          </h3>
          <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
            Dietro ogni startup fallita c&apos;è un fondatore che è andato
            avanti senza struttura. Che sia confusione, risorse sprecate o
            finanziamenti mancati — operare senza un piano solido costa più del
            tempo. Se stai costruendo senza una roadmap, stai volando alla
            cieca.
          </p>
        </div>

        <ul className="bg-card p-6 md:p-12 rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-center gap-4 mb-4">
              <span className="bg-secondary rounded-full p-1">
                <RxCross2 className="text-primary text-md md:text-lg font-extrabold" />
              </span>
              <span className="text-[1rem] md:text-[1.3rem] font-medium text-accent">
                {problem}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
