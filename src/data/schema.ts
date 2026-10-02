export const NODE_LEVEL = {
  COMPANY_TYPE: 'companyType',
  HIRING_GOAL: 'hiringGoal',
  REQUIREMENTS: 'requirements',
  PREPARATION: 'preparation',
  HIRING_CHANNEL: 'hiringChannel',
  HIRING_PROCESS: 'hiringProcess',
  ENDPOINT: 'endpoint',
} as const;

export const COMPANY_TYPE = {
  PRODUCT: 'product',
  STARTUP: 'startup',
  GOVERNMENT: 'government',
  SHARED: 'shared',
} as const;

export type NodeLevel = typeof NODE_LEVEL[keyof typeof NODE_LEVEL];
export type CompanyType = typeof COMPANY_TYPE[keyof typeof COMPANY_TYPE];

export const NODE_LEVELS: NodeLevel[] = Object.values(NODE_LEVEL);
export const COMPANY_TYPES: CompanyType[] = Object.values(COMPANY_TYPE);

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
