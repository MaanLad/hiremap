import { COMPANY_TYPE, NODE_LEVEL } from '../schema';

import type { HiringNode } from '../types';

export const endpoints: HiringNode[] = [
  {
    id: 'hired',
    label: 'Hired',
    subtitle: 'The path reaches an offer',
    level: NODE_LEVEL.ENDPOINT,
    companyType: COMPANY_TYPE.SHARED,
    details: {
      description: 'The candidate completes the relevant selection path and receives an offer.',
    },
  },
];
