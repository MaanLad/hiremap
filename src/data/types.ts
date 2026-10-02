import type { CompanyType, NodeLevel } from './schema';

export interface NodeDetails {
  description?: string;
  examples?: string[];
}

export interface HiringNode {
  id: string;
  label: string;
  subtitle?: string;
  level: NodeLevel;
  companyType: CompanyType;
  details?: NodeDetails;
}

export interface HiringEdge {
  id: string;
  source: string;
  target: string;
}

export interface HiringMap {
  nodes: HiringNode[];
  edges: HiringEdge[];
}
