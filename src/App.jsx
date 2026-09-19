import { AppProvider, ThemeProvider } from './provider/index';
import { HiringMapCanvas } from './component/layout/index';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <div className="h-screen w-screen">
          <HiringMapCanvas />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

// import {
//   ReactFlow,
//   Background,
//   BackgroundVariant,
//   Controls,
//   MiniMap,
//   Panel,
//   Handle,
//   Position,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge,
// } from '@xyflow/react';
// import dagre from '@dagrejs/dagre';

// import '@xyflow/react/dist/style.css';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { ChevronRight, ArrowLeft } from 'lucide-react';

// // ============================================================
// // MAP DATA  (unchanged from your version — trimmed here)
// // ============================================================

// const maps = {
//   main: {
//     nodes: [
//       { id: 'company', type: 'custom', position: { x: 0, y: 100 }, data: { label: 'Company' } },
//       { id: 'frontend', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'Frontend', mapId: 'frontend' } },
//       { id: 'backend', type: 'custom', position: { x: 300, y: 100 }, data: { label: 'Backend', mapId: 'backend' } },
//       { id: 'devops', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'DevOps', mapId: 'devops' } },
//     ],
//     edges: [
//       { id: 'company-frontend', source: 'company', target: 'frontend' },
//       { id: 'company-backend', source: 'company', target: 'backend' },
//       { id: 'company-devops', source: 'company', target: 'devops' },
//     ],
//   },

//   backend: {
//     nodes: [
//       { id: 'backend-root', type: 'custom', position: { x: 0, y: 150 }, data: { label: 'Backend' } },
//       { id: 'nodejs', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'Node.js', mapId: 'nodejs' } },
//       { id: 'database', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'Database', mapId: 'database' } },
//       { id: 'api', type: 'custom', position: { x: 300, y: 250 }, data: { label: 'API' } },
//     ],
//     edges: [
//       { id: 'backend-nodejs', source: 'backend-root', target: 'nodejs' },
//       { id: 'backend-database', source: 'backend-root', target: 'database' },
//       { id: 'backend-api', source: 'backend-root', target: 'api' },
//     ],
//   },

//   nodejs: {
//     nodes: [
//       { id: 'nodejs-root', type: 'custom', position: { x: 0, y: 100 }, data: { label: 'Node.js' } },
//       { id: 'express', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'Express' } },
//       { id: 'nestjs', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'NestJS' } },
//     ],
//     edges: [
//       { id: 'nodejs-express', source: 'nodejs-root', target: 'express' },
//       { id: 'nodejs-nestjs', source: 'nodejs-root', target: 'nestjs' },
//     ],
//   },

//   frontend: {
//     nodes: [
//       { id: 'frontend-root', type: 'custom', position: { x: 0, y: 100 }, data: { label: 'Frontend' } },
//       { id: 'react', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'React' } },
//       { id: 'nextjs', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'Next.js' } },
//     ],
//     edges: [
//       { id: 'frontend-react', source: 'frontend-root', target: 'react' },
//       { id: 'frontend-nextjs', source: 'frontend-root', target: 'nextjs' },
//     ],
//   },

//   devops: {
//     nodes: [
//       { id: 'devops-root', type: 'custom', position: { x: 0, y: 100 }, data: { label: 'DevOps' } },
//       { id: 'docker', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'Docker' } },
//       { id: 'azure', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'Azure' } },
//     ],
//     edges: [
//       { id: 'devops-docker', source: 'devops-root', target: 'docker' },
//       { id: 'devops-azure', source: 'devops-root', target: 'azure' },
//     ],
//   },

//   database: {
//     nodes: [
//       { id: 'database-root', type: 'custom', position: { x: 0, y: 100 }, data: { label: 'Database' } },
//       { id: 'postgres', type: 'custom', position: { x: 300, y: 50 }, data: { label: 'PostgreSQL' } },
//       { id: 'mongodb', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'MongoDB' } },
//     ],
//     edges: [
//       { id: 'database-postgres', source: 'database-root', target: 'postgres' },
//       { id: 'database-mongodb', source: 'database-root', target: 'mongodb' },
//     ],
//   },
// };

// // Fallback size used to compute a node's center for setCenter() before
// // React Flow has actually measured it (node.measured is only populated
// // after first paint). Match this roughly to CustomNode's real footprint.
// const FALLBACK_WIDTH = 160;
// const FALLBACK_HEIGHT = 56;
// const ORBIT_DURATION = 760;
// const GOAL_NODE_ID = 'goal';

// const getChildNodes = (map, origin, ownerMapId) => {
//   const [root, ...children] = map.nodes;
//   const rootCenter = {
//     x: root.position.x + FALLBACK_WIDTH / 2,
//     y: root.position.y + FALLBACK_HEIGHT / 2,
//   };

//   return children.map((node) => ({
//     ...node,
//     position: {
//       x: origin.x - FALLBACK_WIDTH / 2 + node.position.x - rootCenter.x + FALLBACK_WIDTH / 2,
//       y: origin.y - FALLBACK_HEIGHT / 2 + node.position.y - rootCenter.y + FALLBACK_HEIGHT / 2,
//     },
//     data: { ...node.data, ownerMapId },
//   }));
// };

// const layoutGraph = (nodes, edges, anchorId, anchorCenter) => {
//   const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
//   graph.setGraph({ rankdir: 'LR', nodesep: 48, ranksep: 180, marginx: 24, marginy: 24 });

//   nodes.forEach((node) => {
//     graph.setNode(node.id, {
//       width: node.measured?.width ?? FALLBACK_WIDTH,
//       height: node.measured?.height ?? FALLBACK_HEIGHT,
//     });
//   });
//   edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
//   dagre.layout(graph);

//   const anchor = graph.node(anchorId);
//   const offset = {
//     x: anchorCenter.x - anchor.x,
//     y: anchorCenter.y - anchor.y,
//   };

//   return nodes.map((node) => {
//     const position = graph.node(node.id);
//     const width = node.measured?.width ?? FALLBACK_WIDTH;
//     const height = node.measured?.height ?? FALLBACK_HEIGHT;

//     return {
//       ...node,
//       position: {
//         x: position.x - width / 2 + offset.x,
//         y: position.y - height / 2 + offset.y,
//       },
//     };
//   });
// };

// const getNodesCenter = (nodes) => {
//   const bounds = nodes.reduce((current, node) => {
//     const width = node.measured?.width ?? FALLBACK_WIDTH;
//     const height = node.measured?.height ?? FALLBACK_HEIGHT;
//     return {
//       left: Math.min(current.left, node.position.x),
//       top: Math.min(current.top, node.position.y),
//       right: Math.max(current.right, node.position.x + width),
//       bottom: Math.max(current.bottom, node.position.y + height),
//     };
//   }, {
//     left: Infinity,
//     top: Infinity,
//     right: -Infinity,
//     bottom: -Infinity,
//   });

//   return {
//     x: (bounds.left + bounds.right) / 2,
//     y: (bounds.top + bounds.bottom) / 2,
//   };
// };

// const findPath = (edges, sourceId, targetId) => {
//   const queue = [sourceId];
//   const previous = new Map([[sourceId, null]]);

//   while (queue.length > 0) {
//     const currentId = queue.shift();
//     if (currentId === targetId) break;

//     edges
//       .filter((edge) => edge.source === currentId)
//       .forEach((edge) => {
//         if (!previous.has(edge.target)) {
//           previous.set(edge.target, { nodeId: currentId, edgeId: edge.id });
//           queue.push(edge.target);
//         }
//       });
//   }

//   if (!previous.has(targetId)) return null;

//   const nodeIds = [];
//   const edgeIds = [];
//   let currentId = targetId;
//   while (currentId !== null) {
//     nodeIds.unshift(currentId);
//     const step = previous.get(currentId);
//     if (step) edgeIds.unshift(step.edgeId);
//     currentId = step?.nodeId ?? null;
//   }

//   return { nodeIds, edgeIds };
// };

// const addGoalToGraph = (nodes, edges) => {
//   const graphEdges = edges.filter((edge) => edge.target !== GOAL_NODE_ID);
//   const connectedNodeIds = new Set(graphEdges.map((edge) => edge.source));
//   const goalEdges = nodes
//     .filter((node) => node.id !== GOAL_NODE_ID && !connectedNodeIds.has(node.id))
//     .map((node) => ({
//       id: `${node.id}-${GOAL_NODE_ID}`,
//       source: node.id,
//       target: GOAL_NODE_ID,
//     }));
//   const goalNode = nodes.find((node) => node.id === GOAL_NODE_ID) ?? {
//     id: GOAL_NODE_ID,
//     type: 'custom',
//     position: { x: 700, y: 100 },
//     data: { label: 'Goal' },
//   };

//   return {
//     nodes: [...nodes.filter((node) => node.id !== GOAL_NODE_ID), goalNode],
//     edges: [...graphEdges, ...goalEdges],
//   };
// };

// const springProgress = (elapsed) => {
//   const progress = Math.min(elapsed / ORBIT_DURATION, 1);
//   const damping = Math.exp(-7 * progress);
//   const oscillation = Math.cos(progress * Math.PI * 3.5);
//   return progress === 1 ? 1 : 1 - damping * oscillation;
// };

// const animateNodePositions = (fromNodes, toNodes, update) => new Promise((resolve) => {
//   const startedAt = performance.now();

//   const tick = (now) => {
//     const progress = springProgress(now - startedAt);
//     const fadeProgress = Math.min((now - startedAt) / ORBIT_DURATION, 1);
//     const animatedNodes = toNodes.map((node, index) => ({
//       ...node,
//       position: {
//         x: fromNodes[index].position.x
//           + (node.position.x - fromNodes[index].position.x) * progress,
//         y: fromNodes[index].position.y
//           + (node.position.y - fromNodes[index].position.y) * progress,
//       },
//       style: {
//         ...node.style,
//         opacity: (fromNodes[index].style?.opacity ?? 1)
//           + ((node.style?.opacity ?? 1) - (fromNodes[index].style?.opacity ?? 1)) * fadeProgress,
//       },
//     }));

//     update(animatedNodes);

//     if (progress < 1) {
//       requestAnimationFrame(tick);
//     } else {
//       resolve();
//     }
//   };

//   requestAnimationFrame(tick);
// });

// // ============================================================
// // CUSTOM NODE
// // ============================================================

// const CustomNode = ({ data }) => {
//   const expandable = Boolean(data.mapId);

//   const handleClick = () => {
//     if (data.pathMode) {
//       window.dispatchEvent(new CustomEvent('select-path-node', {
//         detail: { nodeId: data.selfId },
//       }));
//     } else if (data.expanded) {
//       window.dispatchEvent(new CustomEvent('close-map', {
//         detail: { mapId: data.mapId, nodeId: data.selfId },
//       }));
//     } else if (expandable) {
//       window.dispatchEvent(new CustomEvent('open-map', { detail: { mapId: data.mapId, nodeId: data.selfId } }));
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className={`
//         relative flex min-w-[160px] items-center justify-between gap-2
//         rounded-node border border-border bg-surface-1 px-4 py-2.5
//         text-sm font-medium text-ink shadow-node transition-colors
//         ${expandable || data.pathMode ? 'cursor-pointer hover:border-route-border hover:text-route' : ''}
//         ${data.pathSelected ? 'border-route-border text-route ring-2 ring-route/20' : ''}
//       `}
//     >
//       <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-none !bg-route" />

//       <span>{data.label}</span>

//       {expandable && <ChevronRight size={14} className="shrink-0 text-ink-faint" />}

//       <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-none !bg-route" />
//     </div>
//   );
// };

// const nodeTypes = { custom: CustomNode };

// // ============================================================
// // APP
// // ============================================================

// export default function App() {
//   // history stack of map ids — replaces the old single currentMap string
//   // so "back" always returns to the *immediate* parent, not always 'main'
//   const [history, setHistory] = useState(['main']);
//   const currentMapId = history[history.length - 1];

//   const initialGraph = addGoalToGraph(maps.main.nodes, maps.main.edges);
//   const [nodes, setNodes] = useState(initialGraph.nodes);
//   const [edges, setEdges] = useState(initialGraph.edges);

//   // true while the expansion is in flight — disables overlapping clicks
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [pathMode, setPathMode] = useState(false);
//   const [pathSelection, setPathSelection] = useState([]);
//   const [selectedPath, setSelectedPath] = useState(null);

//   const rfInstance = useRef(null);
//   const onInit = useCallback((instance) => {
//     rfInstance.current = instance;
//   }, []);

//   // ------------------------------------------------------------
//   // Expand the child map without removing the clicked parent from
//   // the rendered tree.
//   // ------------------------------------------------------------
//   const openMap = useCallback(
//     async (mapId, nodeId) => {
//       const instance = rfInstance.current;
//       const map = maps[mapId];
//       const anchor = nodes.find((node) => node.id === nodeId);
//       if (!instance || !map || !anchor || isTransitioning) return false;

//       setIsTransitioning(true);

//       const origin = {
//         x: anchor.position.x + (anchor.measured?.width ?? FALLBACK_WIDTH) / 2,
//         y: anchor.position.y + (anchor.measured?.height ?? FALLBACK_HEIGHT) / 2,
//       };
//       const children = getChildNodes(map, origin, mapId);
//       const childIds = new Set(children.map((node) => node.id));
//       const expandedNodes = nodes.map((node) => (
//         node.id === nodeId
//           ? { ...node, data: { ...node.data, expanded: true } }
//           : node
//       )).concat(children);
//       const rootId = map.nodes[0].id;
//       const childEdges = map.edges.map((edge) => (
//         edge.source === rootId ? { ...edge, source: nodeId, id: `${nodeId}-${edge.target}` } : edge
//       ));
//       const expandedGraph = addGoalToGraph(expandedNodes, [...edges, ...childEdges]);
//       const laidOutNodes = layoutGraph(
//         expandedGraph.nodes,
//         expandedGraph.edges,
//         nodeId,
//         origin,
//       ).map((node) => (
//         childIds.has(node.id)
//           ? { ...node, style: { ...node.style, opacity: 1 } }
//           : node
//       ));

//       const collapsedLayoutNodes = laidOutNodes.map((node) => (
//         childIds.has(node.id)
//           ? {
//             ...node,
//             position: { x: origin.x - FALLBACK_WIDTH / 2, y: origin.y - FALLBACK_HEIGHT / 2 },
//             style: { ...node.style, opacity: 0 },
//           }
//           : node
//       ));

//       setNodes(collapsedLayoutNodes);
//       setEdges(expandedGraph.edges);
//       await new Promise((resolve) => requestAnimationFrame(resolve));
//       await animateNodePositions(collapsedLayoutNodes, laidOutNodes, setNodes);
//       setNodes(laidOutNodes);
//       const expandedArea = laidOutNodes.filter(
//         (node) => node.id === nodeId || childIds.has(node.id),
//       );
//       const expandedCenter = getNodesCenter(expandedArea);
//       await instance.setCenter(expandedCenter.x, expandedCenter.y, {
//         duration: 180,
//         zoom: Math.max(0.3, instance.getZoom() * 0.9),
//       });
//       setIsTransitioning(false);
//       setHistory((current) => [...current, mapId]);
//       return true;
//     },
//     [edges, isTransitioning, nodes],
//   );

//   // Collapse a map subtree while keeping the expanded parent node visible.
//   const closeMap = useCallback(
//     async (mapId, focusNodeId) => {
//       const instance = rfInstance.current;
//       const mapIndex = history.indexOf(mapId);
//       const focusNode = nodes.find((node) => node.id === focusNodeId);
//       if (!instance || mapIndex < 1 || !focusNode || isTransitioning) return false;

//       setIsTransitioning(true);
//       const removedMapIds = new Set(history.slice(mapIndex));
//       const remainingNodes = nodes
//         .filter((node) => !removedMapIds.has(node.data.ownerMapId))
//         .map((node) => (
//           node.id === focusNodeId
//             ? { ...node, data: { ...node.data, expanded: false } }
//             : node
//         ));
//       const focusPosition = {
//         x: focusNode.position.x + FALLBACK_WIDTH / 2,
//         y: focusNode.position.y + FALLBACK_HEIGHT / 2,
//       };
//       const remainingIds = new Set(remainingNodes.map((node) => node.id));
//       const remainingEdges = edges.filter(
//         (edge) => remainingIds.has(edge.source) && remainingIds.has(edge.target),
//       );
//       const remainingGraph = addGoalToGraph(remainingNodes, remainingEdges);
//       const laidOutRemainingNodes = layoutGraph(
//         remainingGraph.nodes,
//         remainingGraph.edges,
//         focusNodeId,
//         focusPosition,
//       );
//       const closingNodes = nodes.map((node) => {
//         const remaining = laidOutRemainingNodes.find((candidate) => candidate.id === node.id);
//         return remaining || {
//           ...node,
//           position: {
//             x: focusPosition.x - FALLBACK_WIDTH / 2,
//             y: focusPosition.y - FALLBACK_HEIGHT / 2,
//           },
//         };
//       });

//       await animateNodePositions(nodes, closingNodes, setNodes);
//       setNodes(laidOutRemainingNodes);
//       setEdges(remainingGraph.edges);
//       const remainingCenter = getNodesCenter(laidOutRemainingNodes);
//       await instance.setCenter(remainingCenter.x, remainingCenter.y, {
//         duration: 180,
//         zoom: Math.max(0.3, instance.getZoom() * 1),
//       });
//       setHistory((current) => current.slice(0, mapIndex));
//       setIsTransitioning(false);
//       return true;
//     },
//     [history, isTransitioning, nodes],
//   );

//   // go up one level — zoom into this map's own root node, then reveal parent
//   const goBack = useCallback(() => {
//     if (history.length <= 1) return;
//     const parentMapId = history[history.length - 2];
//     const parentAnchor = maps[parentMapId].nodes.find(
//       (node) => node.id === currentMapId || node.data.mapId === currentMapId,
//     );

//     closeMap(currentMapId, parentAnchor?.id);
//   }, [closeMap, currentMapId, history]);

//   // listen for node clicks dispatched from CustomNode
//   useEffect(() => {
//     const handleOpenMap = (event) => openMap(event.detail.mapId, event.detail.nodeId);
//     const handleCloseMap = (event) => closeMap(event.detail.mapId, event.detail.nodeId);
//     const handlePathNode = (event) => {
//       const { nodeId } = event.detail;
//       setPathSelection((current) => {
//         if (current.length === 0) return [nodeId];

//         const sourceId = current[0];
//         if (sourceId === nodeId) return current;

//         setSelectedPath(findPath(edges, sourceId, nodeId));
//         return [sourceId, nodeId];
//       });
//     };
//     window.addEventListener('open-map', handleOpenMap);
//     window.addEventListener('close-map', handleCloseMap);
//     window.addEventListener('select-path-node', handlePathNode);
//     return () => {
//       window.removeEventListener('open-map', handleOpenMap);
//       window.removeEventListener('close-map', handleCloseMap);
//       window.removeEventListener('select-path-node', handlePathNode);
//     };
//   }, [closeMap, edges, openMap]);

//   // stamp each node's own id into data so CustomNode can report it back
//   // (needed so transitionTo knows which node to zoom into on click)
//   const pathNodeIds = new Set(selectedPath?.nodeIds ?? []);
//   const pathEdgeIds = new Set(selectedPath?.edgeIds ?? []);
//   const nodesWithSelfId = nodes.map((n) => ({
//     ...n,
//     data: {
//       ...n.data,
//       selfId: n.id,
//       pathMode,
//       pathSelected: pathNodeIds.has(n.id) || pathSelection.includes(n.id),
//     },
//   }));
//   const edgesWithPath = edges.map((edge) => ({
//     ...edge,
//     type: 'bezier',
//     animated: pathEdgeIds.has(edge.id),
//     style: selectedPath
//       ? pathEdgeIds.has(edge.id)
//         ? { strokeWidth: 3 }
//         : { opacity: 0.18 }
//       : undefined,
//   }));

//   const togglePathMode = () => {
//     setPathMode((current) => !current);
//     setPathSelection([]);
//     setSelectedPath(null);
//   };

//   const onNodesChange = useCallback(
//     (changes) => setNodes((current) => applyNodeChanges(changes, current)),
//     [],
//   );
//   const onEdgesChange = useCallback(
//     (changes) => setEdges((current) => applyEdgeChanges(changes, current)),
//     [],
//   );
//   const onConnect = useCallback(
//     (connection) => setEdges((current) => addEdge(connection, current)),
//     [],
//   );

//   return (
//     <div className="relative h-screen w-screen bg-surface-0">
//       <div className="h-full w-full">
//         <ReactFlow
//           nodes={nodesWithSelfId}
//           edges={edgesWithPath}
//           defaultEdgeOptions={{ type: 'straight' }}
//           nodeTypes={nodeTypes}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onInit={onInit}
//           fitView
//           minZoom={0.3}
//           maxZoom={2.5}
//         >
//           <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} />
//           <Controls showInteractive={false} />
//           <MiniMap pannable zoomable />

//           <Panel position="top-left">
//             <div className="flex items-center gap-2 panel px-3 py-2">
//               <button
//                 onClick={togglePathMode}
//                 disabled={isTransitioning}
//                 className="rounded-node border border-border bg-surface-1 px-2.5 py-1 text-sm text-ink-muted
//                            transition-colors hover:border-route-border hover:text-route disabled:opacity-50"
//               >
//                 {pathMode ? 'Exit path' : 'Find path'}
//               </button>

//               {history.length > 1 && (
//                 <button
//                   onClick={goBack}
//                   disabled={isTransitioning}
//                   className="inline-flex items-center gap-1 rounded-node border border-border
//                              bg-surface-1 px-2.5 py-1 text-sm text-ink-muted transition-colors
//                              hover:border-route-border hover:text-route disabled:opacity-50"
//                 >
//                   <ArrowLeft size={14} />
//                   Back
//                 </button>
//               )}

//               {/* breadcrumb trail — click any crumb to jump back to that level */}
//               <div className="flex items-center gap-1 text-sm text-ink-muted">
//                 {history.map((id, i) => (
//                   <span key={id} className="flex items-center gap-1">
//                     {i > 0 && <ChevronRight size={12} className="text-ink-faint" />}
//                     <span className={i === history.length - 1 ? 'font-medium text-ink' : ''}>
//                       {maps[id].nodes[0].data.label}
//                     </span>
//                   </span>
//                 ))}
//               </div>

//               {pathMode && (
//                 <span className="text-xs text-ink-faint">
//                   {selectedPath
//                     ? 'Path found'
//                     : pathSelection.length === 2
//                       ? 'No path found'
//                       : pathSelection.length === 1
//                         ? 'Select destination'
//                         : 'Select start'}
//                 </span>
//               )}
//             </div>
//           </Panel>
//         </ReactFlow>
//       </div>
//     </div>
//   );
// }