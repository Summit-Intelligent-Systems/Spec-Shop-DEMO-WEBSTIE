/**
 * Razorpay Client SDK Utility for Nayan Sukh Eyewear
 */

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
  method?: 'upi' | 'card' | 'netbanking' | 'wallet';
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: RazorpayPrefill;
  config?: Record<string, any>;
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
  handler?: (response: RazorpayPaymentResponse) => void;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

/**
 * Loads the Razorpay checkout.js script asynchronously
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.getElementById('razorpay-checkout-sdk') ||
      document.getElementById('razorpay-checkout-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      if ((existingScript as any).readyState === 'complete' || window.Razorpay) {
        resolve(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Opens Razorpay payment checkout modal
 */
export const launchRazorpayPayment = async (
  options: Omit<RazorpayOptions, 'handler' | 'modal'> & {
    onSuccess: (res: RazorpayPaymentResponse) => void;
    onDismiss?: () => void;
    onError?: (err: any) => void;
  },
): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load. Please verify your internet connection.');
  }

  const rzpOptions: RazorpayOptions = {
    key: options.key,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'Nayan Sukh Eyewear',
    description: options.description || 'Artisanal Optical & Sunwear Order',
    image: options.image || '/favicon.ico',
    prefill: options.prefill,
    config: options.config,
    notes: options.notes,
    theme: {
      color: '#0D0D0E', // Obsidian signature color
      ...(options.theme || {}),
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) options.onDismiss();
      },
      confirm_close: true,
      escape: true,
    },
    handler: (response: RazorpayPaymentResponse) => {
      options.onSuccess(response);
    },
  };

  if (options.order_id && options.order_id.startsWith('order_')) {
    rzpOptions.order_id = options.order_id;
  }

  const paymentObject = new window.Razorpay(rzpOptions);
  if (options.onError) {
    paymentObject.on('payment.failed', (response: any) => {
      options.onError?.(response?.error);
    });
  }
  paymentObject.open();
};
