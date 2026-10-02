import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const preparation: HiringNode[] = [
  {
    id: 'projects-experience',
    label: 'Projects / Experience',
    subtitle: 'Build proof of readiness',
    level: NODE_LEVEL.PREPARATION,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'Practical work, previous experience, and skill development that support the requirements.',
    },
  },
  {
    id: 'education-examination',
    label: 'Education / Examination',
    subtitle: 'Meet formal qualification criteria',
    level: NODE_LEVEL.PREPARATION,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'Formal education and examination preparation used to satisfy public-sector eligibility.',
    },
  },
  {
    id: 'government-software-preparation',
    label: 'Coding and Systems Practice',
    subtitle: 'Prepare with projects and technical tests',
    level: NODE_LEVEL.PREPARATION,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-data-preparation',
    label: 'Analytics Practice',
    subtitle: 'Practice data interpretation and tools',
    level: NODE_LEVEL.PREPARATION,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-security-preparation',
    label: 'Security Lab Practice',
    subtitle: 'Build network and incident-response skills',
    level: NODE_LEVEL.PREPARATION,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
];
