import { channels } from './nodes/channels';
import { companyTypes } from './nodes/companyTypes';
import { endpoints } from './nodes/endpoints';
import { hiringGoals } from './nodes/hiringGoals';
import { preparation } from './nodes/preparation';
import { processes } from './nodes/processes';
import { requirements } from './nodes/requirements';
import { governmentEdges } from './routes/government';
import { productCompanyEdges } from './routes/productCompany';
import { COMPANY_TYPES, NODE_LEVELS, isNonEmptyString } from './schema';
import type { HiringEdge, HiringMap, HiringNode } from './types';

const nodeGroups: HiringNode[][] = [
  companyTypes,
  hiringGoals,
  requirements,
  preparation,
  channels,
  processes,
  endpoints,
];

const edgeGroups: HiringEdge[][] = [productCompanyEdges, governmentEdges];

export function validateHiringMap({ nodes, edges }: HiringMap): true {
  const errors: string[] = [];
  const nodeIds = new Set();
  const edgeIds = new Set();

  nodes.forEach((node) => {
    if (!isNonEmptyString(node.id)) errors.push('Every node needs a non-empty id.');
    if (!isNonEmptyString(node.label)) errors.push(`Node ${node.id || '<unknown>'} needs a non-empty label.`);
    if (!NODE_LEVELS.includes(node.level)) errors.push(`Node ${node.id} has unsupported level: ${node.level}.`);
    if (!COMPANY_TYPES.includes(node.companyType)) errors.push(`Node ${node.id} has unsupported company type: ${node.companyType}.`);
    if (nodeIds.has(node.id)) errors.push(`Duplicate node id: ${node.id}.`);
    nodeIds.add(node.id);
  });

  edges.forEach((edge) => {
    if (!isNonEmptyString(edge.id)) errors.push('Every edge needs a non-empty id.');
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge id: ${edge.id}.`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source)) errors.push(`Edge ${edge.id} references missing source: ${edge.source}.`);
    if (!nodeIds.has(edge.target)) errors.push(`Edge ${edge.id} references missing target: ${edge.target}.`);
  });

  if (errors.length > 0) {
    throw new Error(`Invalid hiring map data:\n- ${errors.join('\n- ')}`);
  }

  return true;
}

export const hiringMap = {
  nodes: nodeGroups.flat(),
  edges: edgeGroups.flat(),
};

validateHiringMap(hiringMap);

export const mapNodeGroups = {
  companyTypes,
  hiringGoals,
  requirements,
  preparation,
  channels,
  processes,
  endpoints,
};
