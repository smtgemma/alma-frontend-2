
import S11SubscriptionPlan from "@/components/ai-smart-form/S11SubscriptionPlan";
import S5IndustryMarket from "@/components/ai-smart-form/S5Industry&Market";
import S6InvestmentPlan from "@/components/ai-smart-form/S6InvestmentPlan";
import { SmartFormProvider } from "@/components/ai-smart-form/SmartFormContext";

const Subscription = () => {
    return (
        <SmartFormProvider>
            <S11SubscriptionPlan />


        </SmartFormProvider>
    )
}

export default Subscription;