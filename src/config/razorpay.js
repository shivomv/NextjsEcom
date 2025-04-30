// Razorpay configuration
const razorpayConfig = {
  // API keys - use test keys for development
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mZovKJGWt2aMBd',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'qor92M8x9BMwtHZgpGcfoUgT',

  // Log the key being used (without exposing the secret)
  get keyInfo() {
    console.log('Using Razorpay Key ID:', this.key_id);
    return { key_id: this.key_id };
  },

  // Currency and other settings
  currency: 'INR',
  name: 'Prashasak Samiti',
  description: 'Purchase of spiritual products',

  // Customize theme colors to match your site
  theme: {
    color: '#6602C2', // Primary purple color from your gradient
    backdrop_color: '#ffffff',
    hide_topbar: false,
  },

  // Prefill customer information if available
  prefill: {
    name: '',
    email: '',
    contact: '',
    method: 'upi', // Suggest UPI as the default payment method
  },

  // Notes for your reference (optional)
  notes: {
    address: 'Prashasak Samiti Office',
    merchant: 'Prashasak Samiti E-commerce',
  },

  // Payment methods configuration
  config: {
    display: {
      language: 'en',
      hide_topbar: false,
    },
    options: {
      checkout: {
        name: 'Prashasak Samiti',
        prefill: {
          method: 'upi',
        },
      },
    },
    preferences: {
      show_default_blocks: true,
    },
    // Enable all payment methods
    methods: {
      upi: {
        flow: 'intent',
        apps: ['gpay', 'phonepe', 'paytm', 'bhim'],
        enabled: true,
      },
      card: {
        enabled: true,
      },
      netbanking: {
        enabled: true,
      },
      wallet: {
        enabled: true,
      },
    },
  },
};

export default razorpayConfig;
