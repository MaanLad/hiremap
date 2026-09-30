export const companyTypes = [
  {
    id: 'product-company',
    label: 'Product Company',
    subtitle: 'Builds and owns software products',
    level: 'companyType',
    companyType: 'product',
    details: {
      description: 'An organization whose primary work is building and operating its own products.',
      examples: ['SaaS companies', 'Consumer technology', 'Developer tools'],
    },
  },
  {
    id: 'startup',
    label: 'Startup',
    subtitle: 'Small, changing team',
    level: 'companyType',
    companyType: 'startup',
    details: {
      description: 'A young organization where responsibilities and hiring signals can change quickly.',
      examples: ['Early-stage teams', 'Venture-backed companies'],
    },
  },
  {
    id: 'government',
    label: 'Government / PSU',
    subtitle: 'Formal recruitment route',
    level: 'companyType',
    companyType: 'government',
    details: {
      description: 'A public-sector organization with a defined eligibility and selection route.',
      examples: ['Government departments', 'Public sector undertakings'],
    },
  },
];
