import { CompanyTypeNode } from './CompanyTypeNode';
import { HiringGoalNode } from './HiringGoalNode';
import { RequirementsNode } from './RequirementsNode';
import { PreparationNode } from './PreparationNode';
import { HiringChannelNode } from './HiringChannelNode';
import { HiringProcessNode } from './HiringProcessNode';
import { HiringLevelNode } from './HiringLevelNode';

export const hiringNodeTypes = {
  startNode: HiringLevelNode,
  companyTypeNode: CompanyTypeNode,
  hiringGoalNode: HiringGoalNode,
  requirementsNode: RequirementsNode,
  preparationNode: PreparationNode,
  hiringChannelNode: HiringChannelNode,
  hiringProcessNode: HiringProcessNode,
  endpointNode: HiringLevelNode,
};

export function getHiringNodeType(level) {
  if (!level) return 'endpointNode';
  return `${level}Node`;
}
