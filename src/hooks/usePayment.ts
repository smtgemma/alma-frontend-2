import { useState } from 'react';
import { PaymentService } from '../lib/payment-service';
import {
  BillingInfo,
  CreatePaymentMethodRequest,
  CreateSubscriptionResponse,
  PaymentMethodResponse,
  PaymentIntentResponse,
} from '../interfaces/payment';

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  subscription: CreateSubscriptionResponse | null;
  paymentMethod: PaymentMethodResponse | null;
  paymentIntent: PaymentIntentResponse | null;
  isSuccess: boolean;
}

export const usePayment = () => {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    subscription: null,
    paymentMethod: null,
    paymentIntent: null,
    isSuccess: false,
  });

  const resetState = () => {
    setState({
      isLoading: false,
      error: null,
      subscription: null,
      paymentMethod: null,
      paymentIntent: null,
      isSuccess: false,
    });
  };

  const processPayment = async (
    planId: string,
    billingInfo: BillingInfo,
    cardData: CreatePaymentMethodRequest
  ) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
    }));

    try {
      const result = await PaymentService.processPayment(
        planId,
        billingInfo,
        cardData
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
        subscription: result.subscription,
        isSuccess: true,
      }));

      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isSuccess: false,
      }));

      throw error;
    }
  };







  return {
    ...state,
    processPayment,
    resetState,
  };
};
