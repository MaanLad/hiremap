import { ChevronLeft, House, PanelLeft, Settings } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getMotionTransition } from '../../config/animation';
import { useHiringMapStore } from '../../store/hiringMapStore';

const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function MapBreadcrumbPanel() {
  const breadcrumbOpen = useHiringMapStore((state) => state.breadcrumbOpen);
  const activePage = useHiringMapStore((state) => state.activePage);
  const toggleBreadcrumb = useHiringMapStore((state) => state.toggleBreadcrumb);
  const setActivePage = useHiringMapStore((state) => state.setActivePage);
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      aria-label="Map navigation"
      initial={false}
      animate={{ x: breadcrumbOpen ? 0 : 'calc(-100% - 1rem)', opacity: breadcrumbOpen ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : getMotionTransition('panel')}
      className={`map-breadcrumb-panel panel absolute left-4 top-20 z-10 w-64 max-w-[calc(100vw-2rem)] p-4 ${
        breadcrumbOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="flex items-start justify-between border-b border-border pb-3">
        <div>
          <p className="font-mono text-[10px] tracking-wide text-route">NAVIGATION</p>
          <h2 className="mt-1 text-sm font-semibold text-ink">Map workspace</h2>
        </div>
        <button
          type="button"
          onClick={toggleBreadcrumb}
          aria-label="Collapse navigation panel"
          title="Collapse navigation panel"
          className="inline-flex h-7 w-7 items-center justify-center rounded-node text-ink-muted transition-colors hover:bg-route-soft hover:text-route"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <nav aria-label="Main navigation" className="mt-3 space-y-1">
        {NAVIGATION_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActivePage(id)}
            className={`flex w-full items-center gap-2 rounded-node px-3 py-2 text-left text-sm transition-colors ${activePage === id ? 'bg-route-soft font-semibold text-route' : 'text-ink-muted hover:bg-surface-2 hover:text-ink'}`}
          >
            <Icon aria-hidden="true" size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}

export function MapBreadcrumbToggle() {
  const breadcrumbOpen = useHiringMapStore((state) => state.breadcrumbOpen);
  const toggleBreadcrumb = useHiringMapStore((state) => state.toggleBreadcrumb);

  return (
    <button
      type="button"
      onClick={toggleBreadcrumb}
      aria-label={breadcrumbOpen ? 'Collapse navigation panel' : 'Open navigation panel'}
      title={breadcrumbOpen ? 'Collapse navigation panel' : 'Open navigation panel'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-node border border-border bg-surface-1 text-ink-muted transition-colors hover:border-route-border hover:text-route"
    >
      <PanelLeft size={16} />
    </button>
  );
}
