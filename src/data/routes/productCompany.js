export const productCompanyEdges = [
  { id: 'product-to-goal', source: 'product-company', target: 'software-engineering' },
  { id: 'startup-to-goal', source: 'startup', target: 'software-engineering' },
  { id: 'goal-to-requirements', source: 'software-engineering', target: 'technical-requirements' },
  { id: 'requirements-to-preparation', source: 'technical-requirements', target: 'projects-experience' },
  { id: 'preparation-to-channel', source: 'projects-experience', target: 'careers-referral' },
  { id: 'channel-to-process', source: 'careers-referral', target: 'technical-process' },
  { id: 'process-to-hired', source: 'technical-process', target: 'hired' },
];
