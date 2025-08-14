// Nigerian business-focused chat scenarios for demo animations
export interface ChatMessage {
  id: string;
  role: 'user' | 'lexi';
  text: string;
  delay: number;
  showTyping?: boolean;
  showOptions?: string[];
  showChart?: boolean;
  showCelebration?: boolean;
  isVoice?: boolean;
  showVoiceResponse?: boolean;
  masked?: boolean;
  avatar?: string;
}

export interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'payments' | 'analytics' | 'voice' | 'invoice' | 'support';
  duration: number; // in seconds
  messages: ChatMessage[];
}

export const chatScenarios: ChatScenario[] = [
  {
    id: 'supplier-payment',
    title: 'Instant Supplier Payment',
    description: 'Pay your suppliers with voice commands',
    icon: '💸',
    category: 'payments',
    duration: 12,
    messages: [
      {
        id: 'sp1',
        role: 'user',
        text: 'Lexi, send ₦25,000 to my fabric supplier',
        delay: 0,
        avatar: '/avatars/business-owner.png'
      },
      {
        id: 'sp2',
        role: 'lexi',
        text: '🔍 Searching your suppliers...',
        delay: 1500,
        showTyping: true,
        avatar: '/avatars/lexi-avatar.png'
      },
      {
        id: 'sp3',
        role: 'lexi',
        text: 'Found: KEMI FABRICS (Zenith Bank)\nConfirm ₦25,000 transfer?',
        delay: 3000,
        showOptions: ['✅ Yes, send now', '❌ Cancel', '✏️ Change amount']
      },
      {
        id: 'sp4',
        role: 'user',
        text: '✅ Yes, send now',
        delay: 4500
      },
      {
        id: 'sp5',
        role: 'lexi',
        text: '🔐 PIN required for security',
        delay: 5000
      },
      {
        id: 'sp6',
        role: 'user',
        text: '••••',
        delay: 6000,
        masked: true
      },
      {
        id: 'sp7',
        role: 'lexi',
        text: '✅ Payment successful!\n₦25,000 → KEMI FABRICS\nRef: ZEN/TXN/240813/001234\n📱 Receipt sent to your phone',
        delay: 7500,
        showCelebration: true
      }
    ]
  },
  {
    id: 'business-analytics',
    title: 'Business Intelligence',
    description: 'Get instant insights about your business',
    icon: '📊',
    category: 'analytics',
    duration: 10,
    messages: [
      {
        id: 'ba1',
        role: 'user',
        text: 'How is my restaurant doing this month?',
        delay: 0
      },
      {
        id: 'ba2',
        role: 'lexi',
        text: '📊 Analyzing your transactions...',
        delay: 1000,
        showTyping: true
      },
      {
        id: 'ba3',
        role: 'lexi',
        text: '🍽️ LAGOS FOOD SPOT - January Summary:\n\n💰 Revenue: ₦450,000 (+18%)\n💸 Expenses: ₦280,000\n📈 Profit: ₦170,000\n🏆 Best day: Saturdays (₦25k avg)\n\n💡 Tip: Weekend promotions are working!',
        delay: 3000,
        showChart: true
      }
    ]
  },
  {
    id: 'voice-command',
    title: 'Voice Commands',
    description: 'Control your finances with your voice',
    icon: '🎤',
    category: 'voice',
    duration: 8,
    messages: [
      {
        id: 'vc1',
        role: 'user',
        text: '🎤 "Check my account balance"',
        delay: 0,
        isVoice: true
      },
      {
        id: 'vc2',
        role: 'lexi',
        text: '🏦 Your GTBank account balance is ₦125,450.00\n\nWould you like to see recent transactions?',
        delay: 2000,
        showVoiceResponse: true,
        showOptions: ['Yes, show transactions', 'No, thanks']
      }
    ]
  },
  {
    id: 'invoice-generation',
    title: 'Smart Invoicing',
    description: 'Create and send invoices instantly',
    icon: '📄',
    category: 'invoice',
    duration: 11,
    messages: [
      {
        id: 'ig1',
        role: 'user',
        text: 'Create invoice for ₦50k website project for ODIA.DEV',
        delay: 0
      },
      {
        id: 'ig2',
        role: 'lexi',
        text: '📄 Creating invoice...',
        delay: 1500,
        showTyping: true
      },
      {
        id: 'ig3',
        role: 'lexi',
        text: '✅ Invoice #LXP-001 created!\n\n🏢 Client: ODIA.DEV\n💰 Amount: ₦50,000\n📅 Due: 30 days\n📱 Sent via WhatsApp & Email',
        delay: 3000
      },
      {
        id: 'ig4',
        role: 'user',
        text: 'When will I get paid?',
        delay: 6000
      },
      {
        id: 'ig5',
        role: 'lexi',
        text: '📊 Based on ODIA.DEV\'s payment history:\n⏰ Expected payment: 7-14 days\n📈 Your average payment time: 12 days\n🔔 I\'ll remind you if it\'s late',
        delay: 7500
      }
    ]
  },
  {
    id: 'expense-tracking',
    title: 'Expense Tracking',
    description: 'Monitor and control your spending',
    icon: '💳',
    category: 'analytics',
    duration: 9,
    messages: [
      {
        id: 'et1',
        role: 'user',
        text: 'How much did I spend on transport this week?',
        delay: 0
      },
      {
        id: 'et2',
        role: 'lexi',
        text: '🚗 Weekly transport analysis...',
        delay: 1000,
        showTyping: true
      },
      {
        id: 'et3',
        role: 'lexi',
        text: '📊 Transport spending: ₦12,500\n⚠️ You\'re ₦2,500 over budget\n\n📈 Daily breakdown:\n• Mon: ₦2,000 (Uber to VI)\n• Tue: ₦1,500 (Bus to Ikeja)\n• Wed: ₦3,000 (Keke to Lagos Island)\n• Thu: ₦2,500 (Uber to Lekki)\n• Fri: ₦3,500 (Taxi to Airport)\n\n💡 Tip: Use BRT more often to save ₦800/week!',
        delay: 3000
      }
    ]
  },
  {
    id: 'customer-payment',
    title: 'Customer Collection',
    description: 'Get paid faster by your customers',
    icon: '💵',
    category: 'payments',
    duration: 10,
    messages: [
      {
        id: 'cp1',
        role: 'user',
        text: 'Send payment link to John for ₦15,000 consultation',
        delay: 0
      },
      {
        id: 'cp2',
        role: 'lexi',
        text: '🔗 Creating payment link...',
        delay: 1500,
        showTyping: true
      },
      {
        id: 'cp3',
        role: 'lexi',
        text: '✅ Payment link created!\n\n💰 Amount: ₦15,000\n📱 Sent to John: +234812345678\n⏰ Expires in 24 hours\n\nLink supports: Bank transfer, Card, USSD',
        delay: 3000
      },
      {
        id: 'cp4',
        role: 'lexi',
        text: '🎉 John just paid! ₦15,000 received\n📱 Money is in your GTBank account',
        delay: 7000,
        showCelebration: true
      }
    ]
  }
];

// Helper functions for scenario management
export const ScenarioHelpers = {
  // Get scenarios by category
  getByCategory: (category: ChatScenario['category']) => 
    chatScenarios.filter(scenario => scenario.category === category),

  // Get random scenario
  getRandom: () => chatScenarios[Math.floor(Math.random() * chatScenarios.length)],

  // Get scenario by ID
  getById: (id: string) => chatScenarios.find(scenario => scenario.id === id),

  // Get total duration of all messages in a scenario
  getTotalDuration: (scenarioId: string) => {
    const scenario = ScenarioHelpers.getById(scenarioId);
    if (!scenario) return 0;
    
    return scenario.messages.reduce((total, message) => 
      Math.max(total, message.delay + 2000), 0) / 1000; // Add 2s for message display
  },

  // Get popular scenarios (for showcase)
  getPopular: () => [
    chatScenarios.find(s => s.id === 'supplier-payment'),
    chatScenarios.find(s => s.id === 'business-analytics'),
    chatScenarios.find(s => s.id === 'voice-command')
  ].filter(Boolean) as ChatScenario[]
};

export default chatScenarios;