import { NexoraProject, ThemeId } from '../types/project';

export const createEmptyProject = (
  id?: string, 
  name?: string,
  category?: string,
  theme?: ThemeId,
  currency?: string
): NexoraProject => {
  const timestamp = new Date().toISOString();
  const curr = currency || 'USD';
  const sym = curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : curr === 'DZD' ? 'د.ج' : curr === 'AED' ? 'د.إ' : curr === 'SAR' ? '﷼' : curr === 'JPY' ? '¥' : '$';

  return {
    id: id || `proj_${Date.now()}`,
    name: name || 'Untitled Business Venture',
    tagline: 'Transforming opportunity into an executable commercial venture',
    industry: category || 'Technology & SaaS',
    category: category || 'Technology & SaaS',
    theme: theme || 'modern',
    stage: 'Validation',
    brand: {
      primaryColor: '#0EA5E9',
      fontFamily: 'Inter',
    },
    exportSettings: {
      includeFinancials: true,
      includeCompetitors: true,
      includeCanvas: true,
      includeGtm: true,
      includePitch: true,
      format: 'pptx',
      resolution: '1080p',
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    canvas: {
      valuePropositions: {
        title: 'Value Propositions',
        subtitle: 'What unique value do we deliver?',
        description: 'The core bundle of products and services that create value for your customers.',
        items: [
          { id: 'vp-1', text: 'Proprietary automated workflow reducing manual onboarding by 80%', category: 'primary' }
        ]
      },
      customerSegments: {
        title: 'Customer Segments',
        subtitle: 'For whom are we creating value?',
        description: 'The distinct groups of people or organizations an enterprise aims to reach.',
        items: [
          { id: 'cs-1', text: 'Mid-market B2B software companies (50-250 employees)', category: 'primary' }
        ]
      },
      channels: {
        title: 'Channels',
        subtitle: 'How do we reach customer segments?',
        description: 'Communication, distribution, and sales channels.',
        items: [
          { id: 'ch-1', text: 'Direct outbound enterprise sales & LinkedIn social selling', category: 'primary' }
        ]
      },
      customerRelationships: {
        title: 'Customer Relationships',
        subtitle: 'What type of relationship do customers expect?',
        description: 'Established and maintained with each customer segment.',
        items: [
          { id: 'cr-1', text: 'Dedicated customer success onboarding + self-serve analytics portal', category: 'primary' }
        ]
      },
      revenueStreams: {
        title: 'Revenue Streams',
        subtitle: 'For what value are customers really willing to pay?',
        description: 'The cash a company generates from each customer segment.',
        items: [
          { id: 'rs-1', text: 'Tiered monthly SaaS subscription ($249 - $999/mo)', category: 'primary' }
        ]
      },
      keyActivities: {
        title: 'Key Activities',
        subtitle: 'What key activities do value propositions require?',
        description: 'The most important things a company must do to make its model work.',
        items: [
          { id: 'ka-1', text: 'Continuous platform engineering, data integrations, and SLA uptime', category: 'primary' }
        ]
      },
      keyResources: {
        title: 'Key Resources',
        subtitle: 'What key resources do value propositions require?',
        description: 'The assets required to offer and deliver the previously described elements.',
        items: [
          { id: 'kr-1', text: 'Full-stack engineering team, proprietary data pipelines, brand reputation', category: 'primary' }
        ]
      },
      keyPartners: {
        title: 'Key Partners',
        subtitle: 'Who are our key partners and suppliers?',
        description: 'The network of suppliers and partners that make the business model work.',
        items: [
          { id: 'kp-1', text: 'Cloud infrastructure providers, CRM integration marketplace partners', category: 'primary' }
        ]
      },
      costStructure: {
        title: 'Cost Structure',
        subtitle: 'What are the most important costs inherent in our business?',
        description: 'All costs incurred to operate a business model.',
        items: [
          { id: 'cost-1', text: 'Engineering payroll, cloud computing bandwidth, customer acquisition spend', category: 'primary' }
        ]
      }
    },
    financials: {
      currency: curr,
      currencySymbol: sym,
      pricingPerUnit: 299,
      cogsPerUnit: 35,
      cac: 450,
      averageCustomerLifespanMonths: 24,
      monthlyFixedCosts: {
        payroll: 12000,
        softwareHosting: 1800,
        marketingBudget: 4500,
        officeMisc: 1200
      },
      startingCapital: 120000,
      currentCustomers: 45,
      projectedMonthlyGrowthRate: 12
    },
    market: {
      tamValue: 4200,
      tamDescription: 'Total Global Workflow Automation & Intelligence Market ($4.2B)',
      samValue: 850,
      samDescription: 'North American Mid-Market B2B SaaS Workflow Sector ($850M)',
      somValue: 65,
      somDescription: 'Targeted High-Growth Technology Companies with 50-500 seats ($65M)',
      icp: {
        role: 'VP of Product / Head of Operations',
        industry: 'B2B SaaS & Tech Enabled Services',
        companySize: '50 - 350 Employees',
        primaryPainPoint: 'High churn during 60-day customer onboarding and fragmented telemetry',
        budgetOwner: 'Chief Operating Officer / VP Revenue Operations',
        buyingTrigger: 'Recent Series A/B funding or customer churn exceeding 2.5% monthly',
        successMetric: 'Time-to-first-value reduced by 50% and net revenue retention > 115%'
      },
      competitors: [
        {
          id: 'comp-1',
          name: 'LegacyEnterprise Suite',
          pricing: '$1,200/mo + Setup Fee',
          marketShare: '40% (Established incumbent)',
          strengths: 'Extensive legacy brand recognition, enterprise compliance certifications',
          weaknesses: 'Slow 6-month implementations, complex UI, poor developer API',
          differentiator: 'NEXORA enables 1-click deployment with modern intuitive UX and zero setup fee'
        },
        {
          id: 'comp-2',
          name: 'FastPoint Tool',
          pricing: '$89/mo',
          marketShare: '15% (Low-end point solution)',
          strengths: 'Inexpensive, easy sign-up',
          weaknesses: 'Lacks deep workflow customization, fragile integrations, no SLA',
          differentiator: 'Full end-to-end telemetry and enterprise security at accessible mid-market price'
        }
      ]
    },
    gtm: {
      channels: [
        {
          id: 'gtm-1',
          name: 'Targeted Outbound (Apollo / LinkedIn Sales Navigator)',
          type: 'Outbound',
          priority: 'High',
          estimatedCac: 420,
          projectedConversionRate: 4.5,
          status: 'Active'
        },
        {
          id: 'gtm-2',
          name: 'High-Intent Technical SEO & Founder Case Studies',
          type: 'Inbound',
          priority: 'High',
          estimatedCac: 180,
          projectedConversionRate: 3.2,
          status: 'Active'
        },
        {
          id: 'gtm-3',
          name: 'App Marketplace Ecosystems (HubSpot / Salesforce)',
          type: 'Partnerships',
          priority: 'Medium',
          estimatedCac: 260,
          projectedConversionRate: 5.8,
          status: 'Planned'
        }
      ],
      milestones: [
        {
          id: 'm-1',
          phase: 'Phase 1: Validation',
          title: 'Complete 30 discovery calls with ICP Heads of Product',
          targetDate: 'Month 1',
          completed: true
        },
        {
          id: 'm-2',
          phase: 'Phase 2: Beta Launch',
          title: 'Launch invite-only closed beta with 10 paid pilot accounts',
          targetDate: 'Month 3',
          completed: true
        },
        {
          id: 'm-3',
          phase: 'Phase 3: Commercial GTM',
          title: 'Surpass $25,000 MRR and achieve positive unit economics',
          targetDate: 'Month 6',
          completed: false
        },
        {
          id: 'm-4',
          phase: 'Phase 4: Scale',
          title: 'Scale inbound acquisition engine and expand partner integrations',
          targetDate: 'Month 12',
          completed: false
        }
      ],
      targetAudienceMessage: 'Eliminate onboarding friction and turn customer churn into compounding net revenue retention.',
      coreHook: 'The only workflow automation studio engineered specifically for high-velocity software operators.'
    },
    pitch: {
      problemSummary: 'Modern B2B companies lose up to 30% of acquired customers within their first 60 days because legacy onboarding tools are fragmented, manual, and disconnected from product telemetry.',
      solutionSummary: 'NEXORA delivers a unified, intelligent operational workspace that synchronizes customer onboarding, automates verification workflows, and accelerates time-to-value by 80%.',
      marketTiming: 'With capital efficiency now the top priority for tech leadership, companies must maximize net revenue retention rather than relying solely on brute-force customer acquisition.',
      businessModelSummary: 'Predictable high-margin SaaS subscription ($299 to $999/mo) with negative churn expansion driven by team seat adoption and API transaction volume.',
      competitiveMoat: 'Proprietary automated workflow engine combined with pre-built marketplace connectors and 10x faster implementation velocity than legacy enterprise alternatives.',
      financialMilestone12mo: 'Targeting $1.2M ARR within 18 months at 88% gross margins and 14-month cash runway on current capital.',
      capitalAsk: 750000,
      fundAllocation: '60% Engineering & Product Velocity, 25% Go-To-Market & Growth Marketing, 15% Operational Reserve & Compliance.'
    },
    notes: 'Key Focus for this quarter: Refine self-service onboarding flow to lower initial CAC, and publish 3 customer ROI case studies.'
  };
};

export const defaultProject: NexoraProject = {
  ...createEmptyProject('proj_default_nexora', 'NEXORA Business Design Studio'),
  tagline: 'High-velocity operational workspace for modern B2B subscription software'
};
