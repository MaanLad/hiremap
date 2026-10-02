import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const channels: HiringNode[] = [
  {
    id: 'careers-referral',
    label: 'Careers / Referral / Recruiter',
    subtitle: 'Common entry channels',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.PRODUCT,
    details: {
      description: 'Candidates may enter through company careers pages, employee referrals, or recruiter outreach.',
      examples: ['Company Careers', 'Employee Referral', 'Recruiter Outreach'],
    },
  },
  {
    id: 'official-recruitment',
    label: 'Official Recruitment Channel',
    subtitle: 'Published public-sector route',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.GOVERNMENT,
    details: {
      description: 'The official portal, notification, or recruitment event that starts the process.',
    },
  },
  {
    id: 'government-software-channel',
    label: 'Government / PSU Notice',
    subtitle: 'Official vacancy and application portal',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-data-channel',
    label: 'Public Recruitment Portal',
    subtitle: 'Published data-role opening',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
  {
    id: 'government-security-channel',
    label: 'Department / PSU Notification',
    subtitle: 'Security-role recruitment notice',
    level: NODE_LEVEL.HIRING_CHANNEL,
    companyType: COMPANY_TYPE.GOVERNMENT,
  },
];
