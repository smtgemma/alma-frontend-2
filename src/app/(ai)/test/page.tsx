
import S10ReviewPlan from "@/components/ai-smart-form/S10ReviewPlan";
import S11SubscriptionPlan from "@/components/ai-smart-form/S11SubscriptionPlan";
import S5IndustryMarket from "@/components/ai-smart-form/S5Industry&Market";
import S6InvestmentPlan from "@/components/ai-smart-form/S6InvestmentPlan";
import { SmartFormProvider } from "@/components/ai-smart-form/SmartFormContext";

const Test = () => {
    return (
        <SmartFormProvider>
            <S10ReviewPlan />


        </SmartFormProvider>
    )
}

export default Test;