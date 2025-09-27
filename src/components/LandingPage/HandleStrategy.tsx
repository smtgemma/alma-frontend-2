import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

const HandleStrategy = () => {
  const benefits = [
    "Intelligenza Supportata dal Business",
    "Esportazioni Pronte per Pitch",
    "Suggerimenti Intelligenti in Tempo Reale",
    "Un Piano Completo in Pochi Minuti",
    "Nessun Modello, Nessuna Supposizione",
    "Privacy e Conformità GDPR",
    "Rigenera, Ricostruisci, Reimmagina",
  ];

  return (
    <section className="max-w-[1440px] mx-auto bg-white py-10 px-6 md:px-8 ">
      <h2 className=" text-[1.7rem] md:text-[2.3rem] font-semibold text-accent mb-12 ">
        Lascia che l&apos;IA Gestisca la Strategia <br />
        Tu Concentrati sul Sogno
      </h2>

      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
        <div className="flex-1 bg-white rounded-[40px]  p-0 md:p-10 ">
          <div className="px-0 md:px-6">
            <h3 className="text-[1.5rem] md:text-[2rem] font-medium text-primary mb-4">
              7 Vantaggi Chiave. 1 Decisione Intelligente.
            </h3>
            <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
              Ottieni le intuizioni di un stratega esperto e la velocità
              dell&apos;IA senza assumere un team o spendere settimane in
              ricerca. Invece di fare ricerche su Google per ore, ottieni
              risposte reali personalizzate per la tua azienda in secondi.
            </p>
            <ul className=" rounded-[20px] text-sm space-y-2 text-indigo-900 font-medium">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-4 mb-4">
                  <span className="bg-secondary rounded-full p-1">
                    <FaCheck className="text-primary text-md md:text-lg font-normal" />
                  </span>
                  <span className="text-[1rem] md:text-[1.3rem] font-medium text-accent">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-[40px] p-0 md:p-10">
          <div className="">
            <h3 className=" text-[1.5rem] md:text-[2rem] font-medium text-primary mb-4">
              L&apos;intero processo richiede solo minuti del tuo tempo.
            </h3>
            <p className="text-[1rem] md:text-[1.3rem] text-[#475466] font-normal mb-6">
              Non più fissare pagine vuote o modelli obsoleti — inserisci
              semplicemente la tua idea e lascia che il sistema faccia il lavoro
              pesante.
            </p>
            <Image
              src="/images/strategy.png"
              alt="Descriptive alt text"
              width={500}
              height={500}
              className="rounded-lg text-center mx-auto py-10 md:py-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HandleStrategy;
