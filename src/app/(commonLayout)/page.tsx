

import BuildYourPlan from "@/components/LandingPage/BuildYourPlan";
import DemoSolution from "@/components/LandingPage/DemoSolution";
import ExpertConsultation from "@/components/LandingPage/ExpertConsultation";
import Faq from "@/components/LandingPage/Faq";
import HandleStrategy from "@/components/LandingPage/HandleStrategy";
import HeroSection from "@/components/LandingPage/HeroSection";
import IdeatoPlan from "@/components/LandingPage/IdeatoPlan";
import ProblemSection from "@/components/LandingPage/ProblemSection";
import SolutionSection from "@/components/LandingPage/SolutionSection";
import SubscriptionPlan from "@/components/LandingPage/SubscriptionPlan";

const page = () => {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <IdeatoPlan />
      {/* <DemoSolution /> */}
      <SubscriptionPlan />
      <HandleStrategy /> 
      <ExpertConsultation />
      <Faq />
      <BuildYourPlan></BuildYourPlan>
    </div>
  );
};

export default page;