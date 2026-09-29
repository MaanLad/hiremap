import dagre from '@dagrejs/dagre';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 92;

export function toFlowGraph(map) {
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', nodesep: 64, ranksep: 150, marginx: 40, marginy: 40 });

  map.nodes.forEach((node) => graph.setNode(node.id, {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }));
  map.edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  return {
    nodes: map.nodes.map((node) => {
      const position = graph.node(node.id);
      return {
        id: node.id,
        type: 'entity',
        position: {
          x: position.x - NODE_WIDTH / 2,
          y: position.y - NODE_HEIGHT / 2,
        },
        data: node,
      };
    }),
    edges: map.edges.map((edge) => ({
      ...edge,
      type: 'smoothstep',
    })),
  };
}
