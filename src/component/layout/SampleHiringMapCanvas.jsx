import dagre from '@dagrejs/dagre';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MiniMap,
    Position,
    ReactFlow,
    addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ThemeToggle } from '../../provider/index';

const LEVELS = {
    start: { next: 'companyType', label: 'Company Type' },
    companyType: { next: 'network', label: 'Network' },
    network: { next: 'source', label: 'Source' },
    source: { next: 'channel', label: 'Channel' },
};
const NODE_WIDTH = 180;
const NODE_HEIGHT = 76;
const TRANSITION_MS = 420; // keep in sync with the CSS below

const rootNodes = [
    { id: 'start', type: 'sample', data: { label: 'Start', type: 'START', level: 'start' } },
    { id: 'goal', type: 'sample', data: { label: 'Goal', type: 'GOAL' } },
];

// ============================================================
// NODE
// entrance: on mount, flips `entered` true one frame later so the
// CSS transition animates opacity/scale from 0 → 1 ("grows" in).
// exit: controlled externally via data.exiting — set true, wait for
// TRANSITION_MS, then actually remove the node from state.
// ============================================================
function SampleNode({ data }) {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const outer = requestAnimationFrame(() => {
            const inner = requestAnimationFrame(() => setEntered(true));
            return () => cancelAnimationFrame(inner);
        });
        return () => cancelAnimationFrame(outer);
    }, []);

    const visible = entered && !data.exiting;
    const expandable = Boolean(data.level) && data.level !== 'channel';
    const handleClass = '!h-2 !w-2 !border-none !bg-route';

    return (
        <div
            className={`origin-top transition-all ease-out
                ${visible ? 'scale-y-100 opacity-100' : 'scale-y-75 opacity-0 blur-sm'}
        min-w-[180px] rounded-node border bg-surface-1 px-4 py-3 shadow-node
        ${expandable ? 'cursor-pointer border-route-border hover:border-route' : 'border-border'}`}
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
            <Handle type="target" position={Position.Left} className={handleClass} />

            <div
                className={`transition-[filter] duration-500 ease-out
                    ${visible ? 'blur-none' : 'blur-[3px]'}`}
            >
                <span className="mb-1 block font-mono text-[10px] tracking-wide text-route">{data.type}</span>
                <div className="text-sm font-medium text-ink">{data.label}</div>
                {expandable && <div className="mt-1 text-xs text-ink-muted">Click to expand or collapse</div>}
            </div>

            <Handle type="source" position={Position.Right} className={handleClass} />
        </div>
    );
}

const nodeTypes = { sample: SampleNode };

// ============================================================
// GRAPH DATA HELPERS  (unchanged from your version)
// ============================================================

const getChildren = (node) => {
    const level = LEVELS[node.data.level];
    if (!level) return [];
    return ['1', '2', '3'].map((number) => ({
        id: `${level.next}-${node.id}-${number}`,
        type: 'sample',
        data: {
            label: `${level.label} ${number}`,
            type: level.next.toUpperCase(),
            level: level.next,
            parentId: node.id,
        },
    }));
};

const getPreviewPath = (node) => {
    const previewLevels = ['companyType', 'network', 'source', 'channel'];
    const previewLabels = {
        companyType: 'Company Type',
        network: 'Network',
        source: 'Source',
        channel: 'Channel',
    };
    const startIndex = previewLevels.indexOf(node.data.level);
    const visibleLevels = previewLevels.slice(startIndex < 0 ? 0 : startIndex + 1);
    if (visibleLevels.length === 0) {
        return { nodes: [], edges: [{ id: `${node.id}-goal`, source: node.id, target: 'goal' }] };
    }
    const previewNodes = visibleLevels.map((level, index) => ({
        id: `${level}-preview-${node.id}`,
        type: 'sample',
        data: { label: previewLabels[level], type: level.toUpperCase(), preview: true, parentId: node.id },
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

export function SampleHiringMapCanvas() {
    const autoFocus = true;
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [nodes, setNodes] = useState(() => layoutGraph(...Object.values(buildGraph(new Set()))));
    const [edges, setEdges] = useState(() => buildGraph(new Set()).edges);
    const rfInstance = useRef(null);
    const cleanupTimer = useRef(null);

    const onConnect = useCallback((params) => setEdges((current) => addEdge(params, current)), []);

    const onNodeClick = useCallback(
        (event, clickedNode) => {
            if (!clickedNode.data.level || clickedNode.data.level === 'channel') return;

            const nextExpanded = new Set(expandedNodes);
            nextExpanded.has(clickedNode.id) ? nextExpanded.delete(clickedNode.id) : nextExpanded.add(clickedNode.id);

            const nextGraph = buildGraph(nextExpanded);
            const nextLaidOut = layoutGraph(nextGraph.nodes, nextGraph.edges);
            const nextById = new Map(nextLaidOut.map((n) => [n.id, n]));

            setExpandedNodes(nextExpanded);
            setEdges(nextGraph.edges);

            // setNodes((prevNodes) => {
            //     const prevById = new Map(prevNodes.map((n) => [n.id, n]));
            //     const parentNode = nextById.get(clickedNode.id) ?? prevById.get(clickedNode.id);

            //     const exiting = prevNodes
            //         .filter((n) => !nextById.has(n.id))
            //         .map((n) => ({
            //             ...n,
            //             position: getExitTarget(n, prevById, nextById),
            //             data: { ...n.data, exiting: true },
            //             zIndex: -1, // sit behind everything else while fading out
            //         }));

            //     const staying = nextLaidOut.map((n) => {
            //         if (prevById.has(n.id)) return n; // already on screen — just reposition, no spawn needed
            //         // brand new node — park it under the parent for one frame
            //         return {
            //             ...n,
            //             position: parentNode ? getSpawnPosition(parentNode) : n.position,
            //             data: { ...n.data, spawning: true },
            //             zIndex: 1,
            //         };
            //     });

            //     // new nodes render AFTER exiting ones so they layer on top, not under
            //     return [...exiting, ...staying];
            // });

            // one frame later: move newly-spawned nodes to their real dagre position —
            // this is the transform change the CSS transition actually animates

            // setNodes((prevNodes) => {
            //     const prevById = new Map(prevNodes.map((n) => [n.id, n]));

            //     // nodes leaving: keep them mounted a bit longer, redirect their
            //     // position toward the nearest surviving ancestor, flag exiting
            //     // so SampleNode animates itself out
            //     const exiting = prevNodes
            //         .filter((n) => !nextById.has(n.id))
            //         .map((n) => ({
            //             ...n,
            //             position: getExitTarget(n, prevById, nextById),
            //             data: { ...n.data, exiting: true },
            //         }));

            //     // nodes staying/new: same ids reconcile in place (React won't
            //     // remount them, so only their position/transform animates via CSS);
            //     // brand-new ids mount fresh and trigger SampleNode's entrance effect
            //     return [...nextLaidOut, ...exiting];
            // });
            setNodes((prevNodes) => {
                // finalize any exit transition left over from an interrupted previous
                // click BEFORE computing this one — otherwise those ids stay "alive"
                // in state forever and re-expanding them reuses the stale instance
                // instead of mounting fresh (which is why entrance stops working).
                const settled = prevNodes.filter((n) => !n.data.exiting);
                const prevById = new Map(settled.map((n) => [n.id, n]));

                const exiting = settled
                    .filter((n) => !nextById.has(n.id))
                    .map((n) => ({
                        ...n,
                        position: getExitTarget(n, prevById, nextById),
                        data: { ...n.data, exiting: true },
                    }));

                const entering = nextLaidOut.map((nextNode) => {
                    if (prevById.has(nextNode.id)) return nextNode;
                    return {
                        ...nextNode,
                        position: getSpawnPosition(nextNode, prevById, nextById),
                        data: { ...nextNode.data, spawning: true },
                    };
                });

                return [...entering, ...exiting];
            });

            requestAnimationFrame(() => {
                setNodes((current) => current.map((currentNode) => {
                    const final = nextById.get(currentNode.id);
                    return final && currentNode.data.spawning
                        ? { ...final, data: { ...final.data, spawning: false } }
                        : currentNode;
                }));
            });

            if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
            cleanupTimer.current = setTimeout(() => {
                setNodes((current) => current.filter((n) => !n.data.exiting));
            }, TRANSITION_MS + 100);

            requestAnimationFrame(() => {
                if (!autoFocus) return;

                const isExpanding = nextExpanded.has(clickedNode.id);
                const focusIds = isExpanding
                    ? [clickedNode.id, ...nextGraph.nodes.filter((n) => n.data.parentId === clickedNode.id).map((n) => n.id)]
                    : [clickedNode.id];

                const delay = isExpanding ? 24 : 0;
                setTimeout(() => {
                    rfInstance.current?.fitView({
                        nodes: focusIds.map((id) => ({ id })),
                        duration: 300,
                        padding: 0.3,
                    });
                }, delay);
            });
        },
        [autoFocus, expandedNodes],
    );

    useEffect(() => () => clearTimeout(cleanupTimer.current), []);

    return (
        <div className="relative h-full w-full bg-surface-0">
            {/* Position changes on .react-flow__node are just an inline
          transform — this one rule is what makes dagre's re-layout
          animate instead of snapping. */}
            <style>{`
        .react-flow__node {
          transition: transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                onConnect={onConnect}
                onInit={(instance) => {
                    rfInstance.current = instance;
                }}
                defaultEdgeOptions={{ type: 'bezier' }}
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