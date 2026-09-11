export interface IndustryPack {
  id: string;
  name: string;
  recommendedTheme: 'modern' | 'executive' | 'minimal' | 'bold';
  keyMetrics: string[];
  unitTerm: string;
  samplePricing: number;
  sampleCogs: number;
  sampleChannels: string[];
  taglinePlaceholder: string;
}

export const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: 'saas',
    name: 'SaaS / Software',
    recommendedTheme: 'modern',
    keyMetrics: ['ARR / MRR', 'LTV:CAC Ratio', 'Churn Rate', 'Net Dollar Retention'],
    unitTerm: 'Seat / Month',
    samplePricing: 299,
    sampleCogs: 35,
    sampleChannels: ['Product-Led Inbound', 'Targeted Outbound', 'App Marketplaces'],
    taglinePlaceholder: 'Autonomous cloud workflow automation for high-growth enterprises',
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Hospitality',
    recommendedTheme: 'bold',
    keyMetrics: ['Average Ticket', 'Food Cost %', 'Table Turnover', 'Prime Cost %'],
    unitTerm: 'Guest Cover',
    samplePricing: 48,
    sampleCogs: 16,
    sampleChannels: ['Local SEO & Maps', 'Instagram Food Culture', 'Delivery Aggregators'],
    taglinePlaceholder: 'Artisanal farm-to-table dining experience with premium local curation',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & D2C',
    recommendedTheme: 'modern',
    keyMetrics: ['Average Order Value', 'CAC / ROAS', 'Cart Abandonment', 'Repeat Rate'],
    unitTerm: 'Order',
    samplePricing: 85,
    sampleCogs: 28,
    sampleChannels: ['Meta Performance Ads', 'TikTok Creator Marketing', 'Email Retention Flows'],
    taglinePlaceholder: 'Direct-to-consumer sustainable everyday essentials engineered to last',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Hardware',
    recommendedTheme: 'executive',
    keyMetrics: ['OEE Efficiency', 'Unit Bill of Materials', 'Scrap Rate', 'Capacity Utilization'],
    unitTerm: 'Manufactured Unit',
    samplePricing: 450,
    sampleCogs: 210,
    sampleChannels: ['Industrial Trade Expos', 'OEM RFP Submissions', 'B2B Distributor Network'],
    taglinePlaceholder: 'Precision ISO-certified modular hardware components for aerospace applications',
  },
  {
    id: 'service',
    name: 'Service Business',
    recommendedTheme: 'minimal',
    keyMetrics: ['Billable Utilization', 'Client Retainer Size', 'Effective Hourly Rate', 'Client NPS'],
    unitTerm: 'Monthly Retainer',
    samplePricing: 3500,
    sampleCogs: 1100,
    sampleChannels: ['Referral Network', 'Executive Thought Leadership', 'Direct Outbound'],
    taglinePlaceholder: 'Specialized enterprise operational transformation and change management',
  },
  {
    id: 'autoparts',
    name: 'Auto Parts & Mobility',
    recommendedTheme: 'bold',
    keyMetrics: ['Inventory Turns', 'Landed Margin', 'SKU Velocity', 'Warranty Return Rate'],
    unitTerm: 'Component / Kit',
    samplePricing: 160,
    sampleCogs: 65,
    sampleChannels: ['Dealership Service Centers', 'Wholesale Distributors', 'Online Catalog B2B'],
    taglinePlaceholder: 'High-durability aftermarket automotive components with lifetime fitment guarantee',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & AgriTech',
    recommendedTheme: 'minimal',
    keyMetrics: ['Yield per Hectare', 'Input Cost / Acre', 'Off-take Contracts', 'Water Efficiency'],
    unitTerm: 'Metric Ton / Batch',
    samplePricing: 1200,
    sampleCogs: 480,
    sampleChannels: ['Agricultural Cooperatives', 'Direct Food Processors', 'Export Brokers'],
    taglinePlaceholder: 'Climate-resilient organic precision crop farming with sustainable water recycling',
  },
  {
    id: 'trading',
    name: 'Trading / Import & Export',
    recommendedTheme: 'executive',
    keyMetrics: ['Gross Trade Margin', 'Container Turnaround', 'MOQ Fulfillment', 'Customs Clearance Velocity'],
    unitTerm: 'Container / Lot',
    samplePricing: 18500,
    sampleCogs: 13200,
    sampleChannels: ['Global Commodity Exchanges', 'B2B Trade Delegations', 'Freight Forwarding Partnerships'],
    taglinePlaceholder: 'Cross-border supply chain sourcing and commodities distribution network',
  },
  {
    id: 'consulting',
    name: 'Consulting & Advisory',
    recommendedTheme: 'executive',
    keyMetrics: ['Engagement Fee', 'Partner Margin', 'Utilization Rate', 'Project Win Rate'],
    unitTerm: 'Strategy Engagement',
    samplePricing: 15000,
    sampleCogs: 3800,
    sampleChannels: ['Executive C-Suite Referrals', 'Industry Whitepapers', 'Keynote Speaking'],
    taglinePlaceholder: 'Strategic governance, M&A due diligence, and capital allocation advisory',
  },
  {
    id: 'startup',
    name: 'Venture-Backed Startup',
    recommendedTheme: 'modern',
    keyMetrics: ['Compound Monthly Growth', 'Burn Multiple', 'Runway Months', 'Magic Number'],
    unitTerm: 'Active Account',
    samplePricing: 199,
    sampleCogs: 22,
    sampleChannels: ['Developer Community', 'Viral Referral Loops', 'Tech Media & Launch Events'],
    taglinePlaceholder: 'Next-generation AI orchestration platform disrupting legacy enterprise infrastructure',
  },
];
