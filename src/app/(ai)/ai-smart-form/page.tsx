'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import S10ReviewPlan from '@/components/ai-smart-form/S10ReviewPlan';
import S13UnderExpertReview from '@/components/ai-smart-form/S13UnderExpertReview';
import S1BasicInfo from '@/components/ai-smart-form/S1BasicInfo';
import S2BusinessIdea from '@/components/ai-smart-form/S2BusinessIdea';
import S3ValueGeneration from '@/components/ai-smart-form/S3ValueGeneration';
import S4BusinessGoalVision from '@/components/ai-smart-form/S4BusinessGoal&Vision';
import S5IndustryMarket from '@/components/ai-smart-form/S5Industry&Market';
import S6InvestmentPlan from '@/components/ai-smart-form/S6InvestmentPlan';
import S7RevenueModelPricing from '@/components/ai-smart-form/S7RevenueModelPricing';
import S8OperatingCost from '@/components/ai-smart-form/S8OperatingCost';
import S9FinancialPlan from '@/components/ai-smart-form/S9FinancialPlan';
import GeneratedPlanOutput from '@/components/ai-smart-form/GeneratedPlanOutput';
import { SmartFormProvider, useSmartForm } from '@/components/ai-smart-form/SmartFormContext';
import S11SubscriptionPlan from '@/components/ai-smart-form/S11SubscriptionPlan';
import S12SuccessfulSubscription from '@/components/ai-smart-form/S12SuccessfulSubscription';

const steps = [
  S1BasicInfo,
  S2BusinessIdea,
  S3ValueGeneration,
  S4BusinessGoalVision,
  S5IndustryMarket,
  S6InvestmentPlan,
  S7RevenueModelPricing,
  S8OperatingCost,
  S9FinancialPlan,
  S10ReviewPlan,
  S11SubscriptionPlan,
  S12SuccessfulSubscription,
  S13UnderExpertReview
];

const StepContent = () => {
  const searchParams = useSearchParams();
  const { currentStep, generatedPlan, setGeneratedPlan, goToStep } = useSmartForm();
  
  // Handle URL step parameter on mount
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      // Convert to 0-based index (URL uses 1-based, internal uses 0-based)
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= steps.length) {
        goToStep(stepNumber - 1);
      }
    }
  }, [searchParams, goToStep]);
  
  
  
  // If we have a generated plan, show the output component
  if (generatedPlan) {
    
    
    return (
      <GeneratedPlanOutput
        planContent={generatedPlan.content}
        planId={generatedPlan.planId}
        generatedAt={generatedPlan.generatedAt}
        onBack={() => setGeneratedPlan(null)}
      />
    );
  }
  
  const SmartComponent = steps[currentStep];
  return <SmartComponent />;
};

const page = () => {
  return (
    <SmartFormProvider>
      <StepContent />
    </SmartFormProvider>
  );
};

export default page;
