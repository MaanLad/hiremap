import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const processes: HiringNode[] = [
  {
    id: 'technical-process',
    label: 'Screening / Assessment / Interviews',
    subtitle: 'Technical hiring process',
    level: NODE_LEVEL.HIRING_PROCESS,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'The major selection stages after entering a private-sector hiring pipeline.',
    },
  },
  {
    id: 'exam-selection',
    label: 'Exam / Assessment / Selection',
    subtitle: 'Formal selection process',
    level: NODE_LEVEL.HIRING_PROCESS,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'The major examination, assessment, interview, and selection stages.',
    },
  },
  {
    id: 'government-software-process',
    label: 'Technical Test / Interview',
    subtitle: 'Role-specific assessment and selection',
    level: NODE_LEVEL.HIRING_PROCESS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-data-process',
    label: 'Aptitude / Data Assessment',
    subtitle: 'Assessment, interview, and selection',
    level: NODE_LEVEL.HIRING_PROCESS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-security-process',
    label: 'Security Assessment / Interview',
    subtitle: 'Technical and formal selection stages',
    level: NODE_LEVEL.HIRING_PROCESS,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
];
