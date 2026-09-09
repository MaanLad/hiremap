import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './../nodes/index';
import { ThemeToggle } from '../../provider/index';

const initialNodes = [
  {
    id: 'org', type: 'entity', position: { x: 0, y: 0 },
    data: { type: 'ORG', label: 'Product Company', subtitle: 'Mid-size, VC-backed' }
  },
  {
    id: 'channel', type: 'entity', position: { x: 260, y: 0 },
    data: { type: 'CHANNEL', label: 'LinkedIn', subtitle: 'Sourcing channel' }
  },
  {
    id: 'entry', type: 'entity', position: { x: 260, y: 130 },
    data: { type: 'ENTRY', label: 'Recruiter Outreach' }
  },
  {
    id: 'stage', type: 'entity', position: { x: 520, y: 130 },
    data: { type: 'STAGE', label: 'Technical Interview' }
  },
];

// edges are neutral by default — orange only marks the active/selected route
const initialEdges = [
  { id: 'e1', source: 'org', target: 'channel' },
  { id: 'e2', source: 'channel', target: 'entry' },
  { id: 'e3', source: 'entry', target: 'stage', selected: true }, // shown active for demo
];

export function HiringMapCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="relative h-full w-full bg-surface-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable />
      </ReactFlow>

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
    </div>
  );
}