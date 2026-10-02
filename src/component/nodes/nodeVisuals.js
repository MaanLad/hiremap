import { COMPANY_TYPE, NODE_LEVEL } from '../../data/schema';

const companyBackgrounds = {
  [COMPANY_TYPE.PRODUCT]: 'rgba(37, 99, 235, 0.10)',
  [COMPANY_TYPE.STARTUP]: 'rgba(234, 88, 12, 0.11)',
  [COMPANY_TYPE.GOVERNMENT]: 'rgba(5, 150, 105, 0.11)',
  [COMPANY_TYPE.SHARED]: 'rgba(107, 114, 128, 0.10)',
};

export const LEVEL_LEGEND = [
  { level: NODE_LEVEL.COMPANY_TYPE, title: 'Company Type', color: '#2563EB' },
  { level: NODE_LEVEL.HIRING_GOAL, title: 'Hiring Goal', color: '#7C3AED' },
  { level: NODE_LEVEL.REQUIREMENTS, title: 'Requirements', color: '#0891B2' },
  { level: NODE_LEVEL.PREPARATION, title: 'Preparation / Eligibility', color: '#D97706' },
  { level: NODE_LEVEL.HIRING_CHANNEL, title: 'Hiring Channel', color: '#DB2777' },
  { level: NODE_LEVEL.HIRING_PROCESS, title: 'Hiring Process', color: '#059669' },
  { level: NODE_LEVEL.ENDPOINT, title: 'Hired / Endpoint', color: '#4B5563' },
];

const levelBorders = Object.fromEntries(
  LEVEL_LEGEND.map(({ level, color }) => [level, color]),
);

export function getNodeVisuals({ companyType = COMPANY_TYPE.SHARED, level = NODE_LEVEL.ENDPOINT }) {
  return {
    '--node-background': companyBackgrounds[companyType] ?? companyBackgrounds[COMPANY_TYPE.SHARED],
    '--node-border': levelBorders[level] ?? levelBorders[NODE_LEVEL.ENDPOINT],
  };
}

export function getLevelLegend(level) {
  return LEVEL_LEGEND.find((item) => item.level === level) ?? LEVEL_LEGEND.at(-1);
}

export const companyTypeLabels = {
  [COMPANY_TYPE.PRODUCT]: 'Product company',
  [COMPANY_TYPE.STARTUP]: 'Startup',
  [COMPANY_TYPE.GOVERNMENT]: 'Government / PSU',
  [COMPANY_TYPE.SHARED]: 'Shared endpoint',
};
