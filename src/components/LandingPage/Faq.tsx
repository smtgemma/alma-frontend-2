"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // you can use any icon or SVG you prefer

const faqs = [
  {
    question: "Quanto tempo ci vuole per generare un piano aziendale completo?",
    answer:
      "Meno di 10 minuti. Rispondi semplicemente ad alcune domande guidate e la nostra IA genera istantaneamente un piano aziendale strutturato e pronto per gli investitori — completo di riassunto esecutivo, analisi di mercato, strategia e proiezioni.",
  },
  {
    question: "Ho bisogno di esperienza aziendale per usare questo strumento?",
    answer:
      "Non è richiesta alcuna esperienza. La nostra IA ti guida passo dopo passo, rendendo facile per chiunque—che tu sia un imprenditore alle prime armi o un proprietario di azienda esperto.",
  },
  {
    question: "Posso esportare o condividere il mio piano aziendale?",
    answer:
      "Sì, puoi esportare il tuo piano in vari formati (PDF, Word, PowerPoint) e condividerlo facilmente con investitori, partner o team. Il piano è completamente personalizzabile e professionale.",
  },
  {
    question: "I miei dati sono sicuri e privati?",
    answer:
      "Assolutamente sì. Utilizziamo crittografia end-to-end e rispettiamo rigorosamente il GDPR. I tuoi dati sono protetti e non vengono mai condivisi con terze parti senza il tuo consenso esplicito.",
  },
  {
    question:
      "Cosa succede se devo aggiornare o rivedere il mio piano in seguito?",
    answer:
      "Puoi modificare e aggiornare il tuo piano in qualsiasi momento. La nostra piattaforma ti permette di rigenerare sezioni specifiche o l'intero piano con nuove informazioni, mantenendo sempre la coerenza e la qualità.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="max-w-[1440px] mx-auto bg-white py-10 md:py-20 px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Left Side */}
        <div className="md:w-1/2">
          <h2 className="text-primary text-[1.7rem] md:text-[2rem] font-semibold mb-2">
            Domande
            <br />
            <span className="">Frequenti?</span>
          </h2>

          <p className="text-[#475466] text-[16px] md:text-xl font-semibold ">
            Hai domande? Abbiamo risposto alle più comuni.
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={` p-4 ${
                openIndex === index ? "bg-card rounded-md " : ""
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between text-left text-gray-800 text-sm md:text-xl font-semibold focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300  ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                  <span>{faq.question}</span>
                </div>
              </button>

              {openIndex === index && faq.answer && (
                <p className="mt-3 ps-7 text-gray-500 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
