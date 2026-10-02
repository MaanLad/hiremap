import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const hiringGoals: HiringNode[] = [
  {
    id: 'software-engineering',
    label: 'Software Engineering',
    subtitle: 'Build and maintain technical systems',
    level: NODE_LEVEL.HIRING_GOAL,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'A broad technical goal covering application development and engineering work.',
    },
  },
  {
    id: 'technical-recruitment',
    label: 'Technical Recruitment',
    subtitle: 'Role with formal eligibility',
    level: NODE_LEVEL.HIRING_GOAL,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'A technical role entered through an official public-sector recruitment process.',
    },
  },
  {
    id: 'government-software-engineering',
    label: 'Software Engineering',
    subtitle: 'Public systems and applications',
    level: NODE_LEVEL.HIRING_GOAL,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'Test goal 1 for software development roles in government and PSU organizations.',
    },
  },
  {
    id: 'government-data-analytics',
    label: 'Data / Analytics',
    subtitle: 'Data platforms and reporting',
    level: NODE_LEVEL.HIRING_GOAL,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'Test goal 2 for data, reporting, and analytical roles in public organizations.',
    },
  },
  {
    id: 'government-cybersecurity',
    label: 'Cybersecurity',
    subtitle: 'Protect public infrastructure',
    level: NODE_LEVEL.HIRING_GOAL,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'Test goal 3 for security, audit, and infrastructure protection roles.',
    },
  },
];
