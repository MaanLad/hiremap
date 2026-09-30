import dagre from '@dagrejs/dagre';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RotateCcw } from 'lucide-react';
import { MAP_ANIMATION, MAP_VISUAL_OPACITY, getMapAnimation, getMapTransition, getMotionTransition, getReducedMotionCss } from '../../config/animation';
import { MapBreadcrumbPanel, MapBreadcrumbToggle, MapDetailsPanel, MapDetailsPanelToggle, MapLegend, SituationButton } from '../panels/index';
import {
  createGraphIndex,
  hiringMap,
  LEVEL_LABELS,
  LEVEL_TYPES,
  MAP_LEVELS,
} from '../../data/index';
import { getHiringNodeType, hiringNodeTypes } from '../nodes/hiringNodeTypes';
import { ThemeToggle } from '../../provider/index';
import { INITIAL_EXPANDED_IDS, selectRoute, useHiringMapStore } from '../../store/hiringMapStore';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 76;
const rootNodes = [
  { id: 'start', type: 'startNode', data: { label: 'Start', type: 'START', level: 'start', companyType: 'shared' } },
  { id: 'goal', type: 'endpointNode', data: { label: 'Hired', type: 'HIRED', companyType: 'shared' } },
];

const { nodesById: mapNodesById, childrenById: mapChildrenById } = createGraphIndex(hiringMap);

const getMapNode = (id, parentId) => ({
  id,
  type: getHiringNodeType(mapNodesById.get(id).level),
  data: {
    ...mapNodesById.get(id),
    type: LEVEL_TYPES[mapNodesById.get(id).level],
    parentId,
  },
});

// ============================================================
// GRAPH DATA HELPERS
// ============================================================

const getChildren = (node) => {
  if (node.id === 'start') {
    return hiringMap.nodes
      .filter((mapNode) => mapNode.level === 'companyType')
      .map((mapNode) => getMapNode(mapNode.id, node.id));
  }

  return (mapChildrenById.get(node.id) ?? [])
    .map((childId) => getMapNode(childId, node.id));
};

const getPreviewPath = (node) => {
  const startIndex = MAP_LEVELS.indexOf(node.data.level);
  const visibleLevels = MAP_LEVELS.slice(startIndex < 0 ? 0 : startIndex + 1);
  if (visibleLevels.length === 0) {
    return { nodes: [], edges: [{ id: `${node.id}-goal`, source: node.id, target: 'goal' }] };
  }

  const previewNodes = visibleLevels.map((level, index) => ({
    id: `${level}-preview-${node.id}`,
    type: getHiringNodeType(level),
    data: {
      label: LEVEL_LABELS[level],
      type: LEVEL_TYPES[level],
      level,
      companyType: node.data.companyType ?? 'shared',
      preview: true,
      parentId: node.id,
    },
    previewIndex: index,
  }));
  const previewEdges = previewNodes.map((previewNode, index) => ({
    id: `${node.id}-${previewNode.id}`,
    source: index === 0 ? node.id : previewNodes[index - 1].id,
    target: previewNode.id,
  }));
  previewEdges.push({ id: `${previewNodes.at(-1).id}-goal`, source: previewNodes.at(-1).id, target: 'goal' });

  return { nodes: previewNodes, edges: previewEdges };
};

const buildGraph = (expandedNodeIds) => {
  const nodes = [rootNodes[0], rootNodes[1]];
  const edges = [];

  const appendBranch = (parent, sourceId, keepParent = false) => {
    if (!expandedNodeIds.has(parent.id)) {
      if (!keepParent) {
        nodes.push(parent);
        edges.push({ id: `${sourceId}-${parent.id}`, source: sourceId, target: parent.id });
      }
      const preview = getPreviewPath(parent);
      nodes.push(...preview.nodes);
      edges.push(...preview.edges.map((edge) => (
        edge.source === parent.id && edge.id.startsWith(`${parent.id}-`)
          ? { ...edge, id: `${parent.id}-${edge.target}` }
          : edge
      )));
      return;
    }

    const children = getChildren(parent);
    children.forEach((child) => {
      nodes.push(child);
      edges.push({ id: `${sourceId}-${child.id}`, source: sourceId, target: child.id });
      if (expandedNodeIds.has(child.id)) appendBranch(child, child.id);
      else {
        const preview = getPreviewPath(child);
        nodes.push(...preview.nodes);
        edges.push(...preview.edges);
      }
    });
  };

  appendBranch(rootNodes[0], rootNodes[0].id, true);
  return { nodes, edges };
};

const layoutGraph = (nodes, edges) => {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', nodesep: 72, ranksep: 170, marginx: 40, marginy: 40 });
  nodes.forEach((node) => graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);
    return { ...node, position: { x: position.x - NODE_WIDTH / 2, y: position.y - NODE_HEIGHT / 2 } };
  });
};

const withExpansionState = (nodes, expandedNodeIds) => nodes.map((node) => ({
  ...node,
  data: { ...node.data, expanded: expandedNodeIds.has(node.id) },
}));

// Climbs the parentId chain to find where a node should shrink *toward*
// when it exits — checks the upcoming layout first (nextById), then falls
// back to walking further up through the outgoing layout (prevById).
// Fixes the original bug where this silently stopped after one hop.
const getExitTarget = (node, prevById, nextById) => {
  const visited = new Set();
  let parentId = node.data.parentId;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);

    const parentInNext = nextById.get(parentId);
    if (parentInNext) return parentInNext.position;

    const parentInPrev = prevById.get(parentId);
    if (!parentInPrev) break;
    parentId = parentInPrev.data.parentId;
  }

  return node.position; // no ancestor survives either tree — shrink in place
};

const getSpawnPosition = (node, prevById, nextById) => {
  const visited = new Set();
  let parentId = node.data.parentId;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = prevById.get(parentId);
    if (parent) return parent.position;
    const nextParent = nextById.get(parentId);
    if (!nextParent) break;
    parentId = nextParent.data.parentId;
  }

  return node.position;
};

// ============================================================
// CANVAS
// ============================================================

export function HiringMapCanvas() {
  const autoFocus = true;
  const expandedNodes = useHiringMapStore((state) => state.expandedIds);
  const selectedNodeId = useHiringMapStore((state) => state.selectedId);
  const panelOpen = useHiringMapStore((state) => state.panelOpen);
  const hasExplored = useHiringMapStore((state) => state.hasExplored);
  const reduceMotion = useReducedMotion();
  const resetStore = useHiringMapStore((state) => state.reset);
  const [nodes, setNodes] = useState(() => withExpansionState(
    layoutGraph(...Object.values(buildGraph(INITIAL_EXPANDED_IDS))),
    INITIAL_EXPANDED_IDS,
  ));
  const [edges, setEdges] = useState(() => buildGraph(INITIAL_EXPANDED_IDS).edges);
  const rfInstance = useRef(null);
  const cleanupTimer = useRef(null);
  const focusTimer = useRef(null);
  const selectedNodeIdRef = useRef(selectedNodeId);
  selectedNodeIdRef.current = selectedNodeId;
  const routeIds = new Set(selectRoute(nodes, selectedNodeId).map((node) => node.id));
  const connectedIds = new Set([
    ...routeIds,
    ...nodes.filter((node) => node.data.parentId === selectedNodeId).map((node) => node.id),
  ]);
  const hasSelectedRoute = Boolean(selectedNodeId && routeIds.size > 0);
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const getHorizontalNeighbor = (nodeId, direction) => {
    const candidates = edges
      .filter((edge) => (direction === 'right' ? edge.source === nodeId : edge.target === nodeId))
      .map((edge) => direction === 'right' ? edge.target : edge.source)
      .map((id) => nodesById.get(id))
      .filter(Boolean)
      .sort((first, second) => first.position.y - second.position.y);
    return candidates[0]?.id;
  };
  const getVerticalNeighbor = (node) => {
    const siblings = nodes
      .filter((candidate) => candidate.data.parentId === node.data.parentId)
      .sort((first, second) => first.position.y - second.position.y);
    const siblingIndex = siblings.findIndex((sibling) => sibling.id === node.id);
    return {
      up: siblings[siblingIndex - 1]?.id,
      down: siblings[siblingIndex + 1]?.id,
    };
  };
  const displayNodes = nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
    data: {
      ...node.data,
      keyboardNeighbors: {
        ArrowLeft: getHorizontalNeighbor(node.id, 'left'),
        ArrowRight: getHorizontalNeighbor(node.id, 'right'),
        ArrowUp: getVerticalNeighbor(node).up,
        ArrowDown: getVerticalNeighbor(node).down,
      },
      opacityLevel: !hasSelectedRoute || node.id === selectedNodeId
        ? 'selected'
        : connectedIds.has(node.id) ? 'connected' : 'untouched',
    },
  }));
  const displayEdges = edges.map((edge) => {
    const highlighted = hasSelectedRoute && connectedIds.has(edge.source) && connectedIds.has(edge.target);
    return {
      ...edge,
      className: highlighted ? 'map-edge-highlighted' : hasSelectedRoute ? 'map-edge-dimmed' : undefined,
      style: hasSelectedRoute
        ? {
          opacity: highlighted ? MAP_VISUAL_OPACITY.connectedEdge : MAP_VISUAL_OPACITY.untouchedEdge,
          stroke: highlighted ? 'var(--accent)' : undefined,
          strokeWidth: highlighted ? 2 : undefined,
        }
        : undefined,
    };
  });

  const onNodeClick = useCallback(
    (event, clickedNode) => {
      if (event.target.closest?.('[data-node-chevron]')) return;
      useHiringMapStore.getState().select(clickedNode.id);
      setNodes((current) => current.map((node) => ({ ...node, selected: node.id === clickedNode.id })));
    },
    [],
  );

  const onNodeDoubleClick = useCallback((event, clickedNode) => {
    if (event.target.closest?.('[data-node-chevron], [data-node-details]')) return;
    const { openPanel, select } = useHiringMapStore.getState();
    select(clickedNode.id);
    openPanel();
    setNodes((current) => current.map((node) => ({ ...node, selected: node.id === clickedNode.id })));
  }, []);

  useEffect(() => {
    const nextGraph = buildGraph(expandedNodes);
    const nextLaidOut = withExpansionState(layoutGraph(nextGraph.nodes, nextGraph.edges), expandedNodes);
    const nextById = new Map(nextLaidOut.map((node) => [node.id, node]));

    setEdges(nextGraph.edges);
    setNodes((prevNodes) => {
      const settled = prevNodes.filter((node) => !node.data.exiting);
      const prevById = new Map(settled.map((node) => [node.id, node]));
      const exiting = settled
        .filter((node) => !nextById.has(node.id))
        .map((node) => ({
          ...node,
          position: getExitTarget(node, prevById, nextById),
          data: { ...node.data, exiting: true },
        }));
      const entering = nextLaidOut.map((nextNode) => {
        if (prevById.has(nextNode.id)) {
          return { ...nextNode, selected: nextNode.id === selectedNodeIdRef.current };
        }
        return {
          ...nextNode,
          position: getSpawnPosition(nextNode, prevById, nextById),
          selected: nextNode.id === selectedNodeIdRef.current,
          data: { ...nextNode.data, spawning: true },
        };
      });
      return [...entering, ...exiting];
    });

    requestAnimationFrame(() => {
      setNodes((current) => current.map((currentNode) => {
        const final = nextById.get(currentNode.id);
        return final && currentNode.data.spawning
          ? { ...final, selected: final.id === selectedNodeIdRef.current, data: { ...final.data, spawning: false } }
          : currentNode;
      }));
    });

    if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
    cleanupTimer.current = setTimeout(() => {
      setNodes((current) => current.filter((node) => !node.data.exiting));
    }, MAP_ANIMATION.durationMs + 100);

    requestAnimationFrame(() => {
      const focusedId = selectedNodeIdRef.current;
      if (!autoFocus || !focusedId) return;

      const isExpanding = expandedNodes.has(focusedId);
      const focusIds = isExpanding
        ? [focusedId, ...nextGraph.nodes
          .filter((node) => node.data.parentId === focusedId)
          .map((node) => node.id)]
        : [focusedId];

      if (focusTimer.current) clearTimeout(focusTimer.current);
      focusTimer.current = setTimeout(() => {
        rfInstance.current?.fitView({
          nodes: focusIds.map((id) => ({ id })),
          duration: getMapAnimation('focus').durationMs,
          padding: 0.3,
        });
      }, isExpanding ? 24 : 0);
    });
  }, [autoFocus, expandedNodes]);

  const resetMap = useCallback(() => {
    resetStore();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rfInstance.current?.fitView({ duration: 300, padding: 0.3 });
      });
    });
  }, [resetStore]);

  useEffect(() => {
    if (!panelOpen || !selectedNodeId) return undefined;

    const focusTimer = setTimeout(() => {
      rfInstance.current?.fitView({
        nodes: [{ id: selectedNodeId }],
        duration: 300,
        padding: 0.3,
      });
    }, 24);

    return () => clearTimeout(focusTimer);
  }, [panelOpen, selectedNodeId]);

  useEffect(() => () => {
    clearTimeout(cleanupTimer.current);
    clearTimeout(focusTimer.current);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-0">
      {/* Position changes on .react-flow__node are just an inline
          transform — this one rule is what makes dagre's re-layout
          animate instead of snapping. */}
      <style>{`
        .react-flow__node {
          transition: ${getMapTransition('transform')};
        }
        .react-flow__edge {
          transition: opacity ${getMapAnimation('focus').durationMs}ms ${getMapAnimation('focus').easing};
        }
        ${getReducedMotionCss('.react-flow__node, .react-flow__edge, .map-node, .map-node-content')}
      `}</style>

      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={hiringNodeTypes}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onInit={(instance) => {
          rfInstance.current = instance;
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        defaultEdgeOptions={{ type: 'bezier' }}
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable />
      </ReactFlow>

      <div
        className="absolute right-4 top-4 z-20 flex items-start gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={resetMap}
          aria-label="Reset hiring map"
          title="Reset hiring map"
          className="inline-flex h-9 w-9 items-center justify-center rounded-node border border-border bg-surface-1 text-ink-muted transition-colors hover:border-route-border hover:text-route"
        >
          <RotateCcw size={16} />
        </button>
        <MapDetailsPanelToggle />
        <SituationButton />
        <ThemeToggle />
        <MapLegend />
      </div>

      <div
        className="absolute left-4 top-4 z-20 flex items-start gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <MapBreadcrumbToggle />
      </div>

      <AnimatePresence>
        {!hasExplored && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={reduceMotion ? { duration: 0 } : getMotionTransition('focus')}
            className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-node border border-route-border bg-surface-1 px-4 py-2 text-xs text-ink-muted shadow-panel"
          >
            Click a node's chevron to explore
          </motion.div>
        )}
      </AnimatePresence>

      <MapBreadcrumbPanel />
      <MapDetailsPanel nodes={nodes} />
    </div>
  );
}

