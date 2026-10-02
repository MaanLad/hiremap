import { NODE_LEVEL, type NodeLevel } from './schema';
import type { HiringMap } from './types';

export const LEVEL_TYPES: Record<Exclude<NodeLevel, 'endpoint'>, string> = {
  [NODE_LEVEL.COMPANY_TYPE]: 'COMPANY TYPE',
  [NODE_LEVEL.HIRING_GOAL]: 'HIRING GOAL',
  [NODE_LEVEL.REQUIREMENTS]: 'REQUIREMENTS',
  [NODE_LEVEL.PREPARATION]: 'PREPARATION',
  [NODE_LEVEL.HIRING_CHANNEL]: 'HIRING CHANNEL',
  [NODE_LEVEL.HIRING_PROCESS]: 'HIRING PROCESS',
};

export const MAP_LEVELS: Exclude<NodeLevel, 'endpoint'>[] = [
  NODE_LEVEL.COMPANY_TYPE,
  NODE_LEVEL.HIRING_GOAL,
  NODE_LEVEL.REQUIREMENTS,
  NODE_LEVEL.PREPARATION,
  NODE_LEVEL.HIRING_CHANNEL,
  NODE_LEVEL.HIRING_PROCESS,
];

export const LEVEL_LABELS: Record<Exclude<NodeLevel, 'endpoint'>, string> = {
  [NODE_LEVEL.COMPANY_TYPE]: 'Company Type',
  [NODE_LEVEL.HIRING_GOAL]: 'Hiring Goal',
  [NODE_LEVEL.REQUIREMENTS]: 'Requirements',
  [NODE_LEVEL.PREPARATION]: 'Preparation / Eligibility',
  [NODE_LEVEL.HIRING_CHANNEL]: 'Hiring Channel',
  [NODE_LEVEL.HIRING_PROCESS]: 'Hiring Process',
};

export const createGraphIndex = ({ nodes, edges }: HiringMap) => ({
  nodesById: new Map(nodes.map((node) => [node.id, node])),
  childrenById: edges.reduce((children, edge) => {
    const current = children.get(edge.source) ?? [];
    children.set(edge.source, [...current, edge.target]);
    return children;
  }, new Map()),
});