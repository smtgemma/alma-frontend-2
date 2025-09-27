"use client";

import Image from "next/image";

const phases = [
  {
    phase: "Fase 01",
    title: "Rispondi alle Domande IA",
    desc: "Inserisci la tua idea, mercato e obiettivi nella mappatura strategica alimentata da IA.",
    img: "/images/phase1.png",
  },
  {
    phase: "Fase 02",
    title: "L'IA Crea\n il Tuo Piano",
    desc: "Il nostro motore costruisce un piano strutturato con strategia, finanziamenti e roadmap di esecuzione",
    img: "/images/phase2.png",
  },
  {
    phase: "Fase 03",
    title: "Esporta, Presenta e Itera",
    desc: "Scarica il tuo piano, consulta con i mentori o modifica in tempo reale.",
    img: "/images/phase3.png",
  },
];

const IdeatoPlan = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-8">
      {/* Main Title */}
      <div className="max-w-[1440px] mx-auto mb-20">
        <h2 className="text-[1.7rem] md:text-[2.3rem] font-semibold text-accent ml-0 md:ml-0 lg:ml-6">
          Dall\'Idea al Piano in <br />3 Semplici Passaggi
        </h2>
      </div>

      <div className="max-w-[1440px] mx-auto">
        {/* Phase Labels */}
        <div className="flex justify-between mb-8">
          {phases.map((item, idx) => (
            <div key={idx} className="flex-1 text-center">
              <p className="text-xl md:text-[24px] text-accent font-medium">
                {item.phase}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative mb-16">
          {/* Timeline line */}
          <div className="absolute left-0 top-1/2 h-1 w-full bg-secondary transform -translate-y-1/2"></div>

          {/* Timeline circles */}
          <div className="flex justify-between relative z-10">
            {phases.map((item, idx) => (
              <div key={idx} className="flex-1 flex justify-center">
                <span className="bg-secondary rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  <Image
                    src="/images/Vector.png"
                    alt="Checkmark"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 lg:gap-18">
          {phases.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center h-full"
            >
              {/* Title */}
              <h3 className="text-[1.5rem] md:text-[2rem] text-primary font-medium mb-4 max-w-[280px] leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[16px] md:text-[18px] font-normal text-accent mb-8 max-w-[320px] leading-relaxed flex-grow">
                {item.desc}
              </p>

              {/* Icon */}
              <div className="flex justify-center items-center mt-auto">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdeatoPlan;
