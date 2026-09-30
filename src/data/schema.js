export const NODE_LEVELS = [
  'companyType',
  'hiringGoal',
  'requirements',
  'preparation',
  'hiringChannel',
  'hiringProcess',
  'endpoint',
];

export const COMPANY_TYPES = ['product', 'startup', 'government', 'shared'];

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
