import { create } from 'zustand';

export const INITIAL_EXPANDED_IDS = new Set();
export const INITIAL_SITUATION = { role: null, level: null, has: [] };

export const selectRoute = (nodes, selectedId) => {
  if (!selectedId) return [];

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const route = [];
  const visited = new Set();
  let current = nodesById.get(selectedId);

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    route.unshift(current);
    current = current.data.parentId ? nodesById.get(current.data.parentId) : null;
  }

  return route;
};

export const selectRelatedNodes = (nodes, selectedId) => {
  const selected = nodes.find((node) => node.id === selectedId);
  if (!selected) return [];

  return nodes.filter((node) => (
    node.id !== selectedId && node.data.label === selected.data.label
  ));
};

export const selectEdgeHighlight = (edge, routeIds) => (
  routeIds.includes(edge.source) && routeIds.includes(edge.target)
);

export const useHiringMapStore = create((set) => ({
  expandedIds: new Set(INITIAL_EXPANDED_IDS),
  selectedId: null,
  showCrossLinks: false,
  hoveredId: null,
  panelOpen: false,
  breadcrumbOpen: false,
  activePage: 'home',
  hasExplored: false,
  situation: INITIAL_SITUATION,
  situationOpen: false,
  activePanelTab: 'details',

  toggleExpand: (id) => set((state) => {
    const expandedIds = new Set(state.expandedIds);
    expandedIds.has(id) ? expandedIds.delete(id) : expandedIds.add(id);
    return { expandedIds, hasExplored: true };
  }),
  select: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),
  reveal: (ids) => set((state) => ({
    expandedIds: new Set([...state.expandedIds, ...ids]),
  })),
  collapseAll: () => set({ expandedIds: new Set() }),
  reset: () => set({
    expandedIds: new Set(INITIAL_EXPANDED_IDS),
    selectedId: null,
    hoveredId: null,
    panelOpen: false,
    breadcrumbOpen: false,
    activePage: 'home',
    hasExplored: false,
    situation: { ...INITIAL_SITUATION, has: [] },
    situationOpen: false,
    activePanelTab: 'details',
  }),
  openPanel: () => set({ panelOpen: true }),
  toggleDetails: (id) => set((state) => (
    state.panelOpen && state.selectedId === id
      ? { panelOpen: false }
      : { selectedId: id, panelOpen: true }
  )),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
  toggleBreadcrumb: () => set((state) => ({ breadcrumbOpen: !state.breadcrumbOpen })),
  setActivePage: (activePage) => set({ activePage }),
  setSituation: (nextSituation) => set((state) => ({
    situation: { ...state.situation, ...nextSituation },
  })),
  clearSituation: () => set({ situation: { ...INITIAL_SITUATION, has: [] } }),
  toggleSituation: () => set((state) => ({ situationOpen: !state.situationOpen })),
  setPanelTab: (activePanelTab) => set({ activePanelTab }),
}));
