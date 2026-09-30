export const LEVEL_TYPES = {
  companyType: 'COMPANY TYPE',
  hiringGoal: 'HIRING GOAL',
  requirements: 'REQUIREMENTS',
  preparation: 'PREPARATION',
  hiringChannel: 'HIRING CHANNEL',
  hiringProcess: 'HIRING PROCESS',
};

export const MAP_LEVELS = [
  'companyType',
  'hiringGoal',
  'requirements',
  'preparation',
  'hiringChannel',
  'hiringProcess',
];

export const LEVEL_LABELS = {
  companyType: 'Company Type',
  hiringGoal: 'Hiring Goal',
  requirements: 'Requirements',
  preparation: 'Preparation / Eligibility',
  hiringChannel: 'Hiring Channel',
  hiringProcess: 'Hiring Process',
};

export const createGraphIndex = ({ nodes, edges }) => ({
  nodesById: new Map(nodes.map((node) => [node.id, node])),
  childrenById: edges.reduce((children, edge) => {
    const current = children.get(edge.source) ?? [];
    children.set(edge.source, [...current, edge.target]);
    return children;
  }, new Map()),
});