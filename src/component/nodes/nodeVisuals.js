const companyBackgrounds = {
  product: 'rgba(37, 99, 235, 0.10)',
  startup: 'rgba(234, 88, 12, 0.11)',
  government: 'rgba(5, 150, 105, 0.11)',
  shared: 'rgba(107, 114, 128, 0.10)',
};

export const LEVEL_LEGEND = [
  { level: 'companyType', title: 'Company Type', color: '#2563EB' },
  { level: 'hiringGoal', title: 'Hiring Goal', color: '#7C3AED' },
  { level: 'requirements', title: 'Requirements', color: '#0891B2' },
  { level: 'preparation', title: 'Preparation / Eligibility', color: '#D97706' },
  { level: 'hiringChannel', title: 'Hiring Channel', color: '#DB2777' },
  { level: 'hiringProcess', title: 'Hiring Process', color: '#059669' },
  { level: 'endpoint', title: 'Hired / Endpoint', color: '#4B5563' },
];

const levelBorders = Object.fromEntries(
  LEVEL_LEGEND.map(({ level, color }) => [level, color]),
);

export function getNodeVisuals({ companyType = 'shared', level = 'endpoint' }) {
  return {
    '--node-background': companyBackgrounds[companyType] ?? companyBackgrounds.shared,
    '--node-border': levelBorders[level] ?? levelBorders.endpoint,
  };
}

export function getLevelLegend(level) {
  return LEVEL_LEGEND.find((item) => item.level === level) ?? LEVEL_LEGEND.at(-1);
}

export const companyTypeLabels = {
  product: 'Product company',
  startup: 'Startup',
  government: 'Government / PSU',
  shared: 'Shared endpoint',
};
