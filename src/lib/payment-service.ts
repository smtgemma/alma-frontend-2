import axios from 'axios';
import { API_BASE_URL } from './stripe';
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CreatePaymentMethodRequest,
  PaymentMethodResponse,
  ConfirmPaymentIntentRequest,
  PaymentIntentResponse,
  BillingInfo
} from '../interfaces/payment';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 DEBUG: Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ DEBUG: No token found in localStorage');
    }
    console.log('🔍 DEBUG: Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ DEBUG: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export class PaymentService {
  /**
   * Complete payment flow - Backend handles everything
   * Just call the subscription API, backend handles all Stripe integration
   */
  static async processPayment(
    planId: string,
    billingInfo: BillingInfo,
    cardData: CreatePaymentMethodRequest
  ): Promise<{
    subscription: CreateSubscriptionResponse;
  }> {
    try {
      console.log('🚀 DEBUG: Starting payment flow...');
      
      // Send everything to backend in one call
      const requestData = {
        planId,
        billingInfo,
        cardData,
      };

      console.log('📋 DEBUG: Sending payment data to backend:', requestData);

      const response = await apiClient.post<CreateSubscriptionResponse>(
        '/billing/subscribe',
        requestData
      );

      console.log('🎉 DEBUG: Payment completed by backend:', response.data);
      
      return {
        subscription: response.data,
      };
    } catch (error) {
      console.error('❌ DEBUG: Payment failed:', error);
      throw error;
    }
  }
}
