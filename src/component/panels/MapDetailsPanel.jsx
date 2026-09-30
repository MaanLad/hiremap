import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getMotionTransition } from '../../config/animation';
import { selectRoute, useHiringMapStore } from '../../store/hiringMapStore';

export function MapDetailsPanel({ nodes }) {
  const selectedId = useHiringMapStore((state) => state.selectedId);
  const panelOpen = useHiringMapStore((state) => state.panelOpen);
  const togglePanel = useHiringMapStore((state) => state.togglePanel);
  const select = useHiringMapStore((state) => state.select);
  const reveal = useHiringMapStore((state) => state.reveal);
  const route = selectRoute(nodes, selectedId);
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      aria-label="Hiring map details"
      initial={false}
      animate={{
        x: panelOpen ? 0 : 'var(--panel-exit-x)',
        y: panelOpen ? 0 : 'var(--panel-exit-y)',
        opacity: panelOpen ? 1 : 0,
      }}
      transition={reduceMotion ? { duration: 0 } : getMotionTransition('panel')}
      className={`map-details-panel panel absolute bottom-0 left-0 right-0 z-10 max-h-[42vh] overflow-y-auto rounded-b-none p-5 md:bottom-4 md:left-auto md:right-4 md:top-20 md:w-96 md:max-h-none md:rounded-b-panel ${
        panelOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ '--panel-exit-x': '0px', '--panel-exit-y': '100%' }}
    >
      <style>{`@media (min-width: 768px) { .map-details-panel { --panel-exit-x: calc(100% + 1rem); --panel-exit-y: 0px; } }`}</style>
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] tracking-wide text-route">NODE DETAILS</p>
          <h2 className="mt-1 text-base font-semibold text-ink">Hiring map node</h2>
          <p className="mt-1 text-xs text-ink-muted">
            {selectedId ? `Selected node: ${selectedId}` : 'Select a node to inspect it.'}
          </p>
        </div>
        <button
          type="button"
          onClick={togglePanel}
          aria-label="Collapse details panel"
          title="Collapse details panel"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-node text-ink-muted transition-colors hover:bg-route-soft hover:text-route"
        >
          <PanelRightClose size={17} />
        </button>
      </div>

      <section className="border-b border-border py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Path it comes from</h3>
        {route.length > 0 ? (
          <ol className="mt-3 space-y-1">
            {route.map((node, index) => (
              <li key={node.id} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true" className="text-ink-faint">&rarr;</span>}
                <button
                  type="button"
                  onClick={() => {
                    reveal(route.slice(0, index).map((step) => step.id));
                    select(node.id);
                  }}
                  className={`min-w-0 truncate text-left text-sm transition-colors hover:text-route ${node.id === selectedId ? 'font-semibold text-route' : 'text-ink'}`}
                >
                  {node.data.label}
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-ink-faint">Choose a node to see its path.</p>
        )}
      </section>

      <div className="divide-y divide-border">
        <section className="py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Overview</h3>
          <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
        </section>
        <section className="py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Requirements</h3>
          <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
        </section>
        <section className="py-4 pb-0">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Connections</h3>
          <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
        </section>
      </div>
    </motion.aside>
  );
}

export function MapDetailsPanelToggle() {
  const panelOpen = useHiringMapStore((state) => state.panelOpen);
  const togglePanel = useHiringMapStore((state) => state.togglePanel);

  return (
    <button
      type="button"
      onClick={togglePanel}
      aria-label={panelOpen ? 'Collapse details panel' : 'Expand details panel'}
      title={panelOpen ? 'Collapse details panel' : 'Expand details panel'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-node border border-border bg-surface-1 text-ink-muted transition-colors hover:border-route-border hover:text-route"
    >
      {panelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
    </button>
  );
}

// import { PanelRightClose, PanelRightOpen } from 'lucide-react';
// import { motion, useReducedMotion } from 'framer-motion';
// import { getMotionTransition } from '../../config/animation';
// import { selectRoute, useHiringMapStore } from '../../store/hiringMapStore';
// import { RoutesTab } from './RoutesTab';

// export function MapDetailsPanel({ nodes }) {
//   const selectedId = useHiringMapStore((state) => state.selectedId);
//   const panelOpen = useHiringMapStore((state) => state.panelOpen);
//   const togglePanel = useHiringMapStore((state) => state.togglePanel);
//   const select = useHiringMapStore((state) => state.select);
//   const reveal = useHiringMapStore((state) => state.reveal);
//   const activePanelTab = useHiringMapStore((state) => state.activePanelTab);
//   const route = selectRoute(nodes, selectedId);
//   const reduceMotion = useReducedMotion();

//   return (
//     <motion.aside
//       aria-label="Hiring map details"
//       initial={false}
//       animate={{
//         x: panelOpen ? 0 : 'var(--panel-exit-x)',
//         y: panelOpen ? 0 : 'var(--panel-exit-y)',
//         opacity: panelOpen ? 1 : 0,
//       }}
//       transition={reduceMotion ? { duration: 0 } : getMotionTransition('panel')}
//       className={`map-details-panel panel absolute bottom-0 left-0 right-0 z-10 max-h-[42vh] overflow-y-auto rounded-b-none p-5 md:bottom-4 md:left-auto md:right-4 md:top-20 md:w-96 md:max-h-none md:rounded-b-panel ${
//         panelOpen ? 'pointer-events-auto' : 'pointer-events-none'
//       }`}
//       style={{ '--panel-exit-x': '0px', '--panel-exit-y': '100%' }}
//     >
//       <style>{`@media (min-width: 768px) { .map-details-panel { --panel-exit-x: calc(100% + 1rem); --panel-exit-y: 0px; } }`}</style>
//       <div className="flex items-start justify-between border-b border-border pb-4">
//         <div>
//           <p className="font-mono text-[10px] tracking-wide text-route">NODE DETAILS</p>
//           <h2 className="mt-1 text-base font-semibold text-ink">Hiring map node</h2>
//           <p className="mt-1 text-xs text-ink-muted">
//             {selectedId ? `Selected node: ${selectedId}` : 'Select a node to inspect it.'}
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={togglePanel}
//           aria-label="Collapse details panel"
//           title="Collapse details panel"
//           className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-node text-ink-muted transition-colors hover:bg-route-soft hover:text-route"
//         >
//           <PanelRightClose size={17} />
//         </button>
//       </div>

//       <div role="tablist" aria-label="Details views" className="mt-4 grid grid-cols-2 rounded-node bg-surface-2 p-1">
//         {[
//           { id: 'details', label: 'Details' },
//           { id: 'routes', label: 'Routes' },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             type="button"
//             role="tab"
//             aria-selected={activePanelTab === tab.id}
//             onClick={() => useHiringMapStore.getState().setPanelTab(tab.id)}
//             className={`rounded-sm px-2 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-route ${activePanelTab === tab.id ? 'bg-surface-1 text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {activePanelTab === 'routes' ? <RoutesTab /> : <>
//       <section className="border-b border-border py-4">
//         <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Path it comes from</h3>
//         {route.length > 0 ? (
//           <ol className="mt-3 space-y-1">
//             {route.map((node, index) => (
//               <li key={node.id} className="flex items-center gap-2">
//                 {index > 0 && <span aria-hidden="true" className="text-ink-faint">&rarr;</span>}
//                 <button
//                   type="button"
//                   onClick={() => {
//                     reveal(route.slice(0, index).map((step) => step.id));
//                     select(node.id);
//                   }}
//                   className={`min-w-0 truncate text-left text-sm transition-colors hover:text-route ${node.id === selectedId ? 'font-semibold text-route' : 'text-ink'}`}
//                 >
//                   {node.data.label}
//                 </button>
//               </li>
//             ))}
//           </ol>
//         ) : (
//           <p className="mt-2 text-sm text-ink-faint">Choose a node to see its path.</p>
//         )}
//       </section>

//       <div className="divide-y divide-border">
//         <section className="py-4">
//           <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Overview</h3>
//           <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
//         </section>
//         <section className="py-4">
//           <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Requirements</h3>
//           <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
//         </section>
//         <section className="py-4 pb-0">
//           <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Connections</h3>
//           <p className="mt-2 text-sm text-ink-faint">Content will appear here later.</p>
//         </section>
//       </div>
//       </>}
//     </motion.aside>
//   );
// }

// export function MapDetailsPanelToggle() {
//   const panelOpen = useHiringMapStore((state) => state.panelOpen);
//   const togglePanel = useHiringMapStore((state) => state.togglePanel);

//   return (
//     <button
//       type="button"
//       onClick={togglePanel}
//       aria-label={panelOpen ? 'Collapse details panel' : 'Expand details panel'}
//       title={panelOpen ? 'Collapse details panel' : 'Expand details panel'}
//       className="inline-flex h-9 w-9 items-center justify-center rounded-node border border-border bg-surface-1 text-ink-muted transition-colors hover:border-route-border hover:text-route"
//     >
//       {panelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
//     </button>
//   );
// }
