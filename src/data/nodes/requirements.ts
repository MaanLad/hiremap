import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const requirements: HiringNode[] = [
  {
    id: 'technical-requirements',
    label: 'Technical + Experience Requirements',
    subtitle: 'Skills, projects, and evidence of ability',
    level: NODE_LEVEL.REQUIREMENTS,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'The general capability and evidence expected for the target role.',
      examples: ['Technical capability', 'Relevant projects', 'Interview readiness'],
    },
  },
  {
    id: 'eligibility-requirements',
    label: 'Eligibility Requirements',
    subtitle: 'Education and examination criteria',
    level: NODE_LEVEL.REQUIREMENTS,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'The qualifications and conditions that determine whether a candidate can enter the route.',
    },
  },
  {
    id: 'government-software-requirements',
    label: 'CS / IT Qualification',
    subtitle: 'Technical degree and programming basics',
    level: NODE_LEVEL.REQUIREMENTS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-data-requirements',
    label: 'Data and Statistics Eligibility',
    subtitle: 'Quantitative and analytical foundation',
    level: NODE_LEVEL.REQUIREMENTS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-security-requirements',
    label: 'Security and Systems Eligibility',
    subtitle: 'Networks, systems, and security fundamentals',
    level: NODE_LEVEL.REQUIREMENTS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
];
