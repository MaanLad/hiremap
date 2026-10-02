import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const companyTypes: HiringNode[] = [
  {
    id: 'product-company',
    label: 'Product Company',
    subtitle: 'Builds and owns software products',
    level: NODE_LEVEL.COMPANY_TYPE,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'An organization whose primary work is building and operating its own products.',
      examples: ['SaaS companies', 'Consumer technology', 'Developer tools'],
    },
  },
  {
    id: 'startup',
    label: 'Startup',
    subtitle: 'Small, changing team',
    level: NODE_LEVEL.COMPANY_TYPE,
    companyType: COMPANY_TYPE.STARTUP,
    details: {
      description: 'A young organization where responsibilities and hiring signals can change quickly.',
      examples: ['Early-stage teams', 'Venture-backed companies'],
    },
  },
  {
    id: 'government',
    label: 'Government / PSU',
    subtitle: 'Formal recruitment route',
    level: NODE_LEVEL.COMPANY_TYPE,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'A public-sector organization with a defined eligibility and selection route.',
      examples: ['Government departments', 'Public sector undertakings'],
    },
  },
];
