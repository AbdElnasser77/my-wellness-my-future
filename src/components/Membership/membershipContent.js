/*
 * Membership plans — content from mywellnessmyfuture.com.
 * Prices are in AED; a price of 0 shows as "Free".
 */
export const PLANS = [
  {
    id: 'free',
    name: 'Free Membership',
    idealFor: 'General community members',
    monthly: 0,
    yearly: 0,
    cta: 'Get Started',
    benefits: [
      'Access to free weekly newsletter',
      'Participation in selected awareness events',
      'Access to some blog content',
      'Health tips via email or app notification',
      'One free consultation',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    idealFor: 'Members who want more active support',
    monthly: 100,
    yearly: 500,
    cta: 'Join Membership',
    featured: true,
    benefits: [
      'All free benefits',
      'Monthly health consultations (online or offline)',
      'Entry to private webinars / workshops',
      'Discounts on checkups or wellness treatments',
      'Access to exclusive digital resources',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Membership',
    idealFor: 'Executives using premium services',
    monthly: 250,
    yearly: 1500,
    cta: 'Get Started',
    benefits: [
      'All Premium benefits',
      'Direct consultation with wellness experts',
      'Priority booking for sessions / events',
      'Welcome gift or wellness box',
      'Access to regenerative service packages',
    ],
  },
]
