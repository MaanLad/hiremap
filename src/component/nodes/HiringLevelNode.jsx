import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GitBranch, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';
import { NODE_LEVEL } from '../../data/index';
import { getMotionTransition, MAP_VISUAL_OPACITY } from '../../config/animation';
import { useHiringMapStore } from '../../store/hiringMapStore';
import { getNodeVisuals } from './nodeVisuals';

export function HiringLevelNode({ data, id, selected }) {
  const detailsOpen = useHiringMapStore((state) => state.panelOpen && state.selectedId === id);
  const reduceMotion = useReducedMotion();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipTimer = useRef(null);
  const expandable = Boolean(data.level) && data.level !== NODE_LEVEL.HIRING_PROCESS;
  const handleClass = '!h-2 !w-2 !border-none !bg-route';
  const summary = data.subtitle ?? data.details?.description ?? 'Explore this stage of the hiring map.';
  const nodeOpacity = MAP_VISUAL_OPACITY[data.opacityLevel ?? 'selected'];

  useEffect(() => () => clearTimeout(tooltipTimer.current), []);

  const showTooltip = () => {
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltipOpen(true), 300);
  };

  const hideTooltip = () => {
    clearTimeout(tooltipTimer.current);
    setTooltipOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      if (!expandable) return;
      event.preventDefault();
      const { select, toggleExpand } = useHiringMapStore.getState();
      select(id);
      toggleExpand(id);
      return;
    }

    const nextId = data.keyboardNeighbors?.[event.key];
    if (!nextId) return;

    event.preventDefault();
    event.stopPropagation();
    const { select } = useHiringMapStore.getState();
    select(nextId);
    requestAnimationFrame(() => document.querySelector(`[data-node-card="${nextId}"]`)?.focus());
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scaleY: 0.75, filter: 'blur(3px)' }}
      animate={{
        opacity: data.exiting ? 0 : nodeOpacity,
        scaleY: data.exiting ? 0.75 : 1,
        filter: data.exiting ? 'blur(3px)' : data.opacityLevel === 'untouched' ? 'saturate(0.7)' : 'blur(0px)',
      }}
      transition={reduceMotion ? { duration: 0 } : getMotionTransition('default')}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onKeyDown={onKeyDown}
      tabIndex={0}
      data-node-card={id}
      aria-label={`${data.label}. Use arrow keys to move through connected nodes.`}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space"
      className={`map-node origin-top transition-all ease-out
        relative min-w-45 rounded-node border bg-surface-1 px-4 py-3 shadow-node
        ${selected ? 'z-10 ring-2 ring-route ring-offset-2 ring-offset-surface-0' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-route focus-visible:ring-offset-2
        ${expandable ? 'cursor-pointer border-route-border hover:border-route' : 'border-border'}`}
      style={{
        ...getNodeVisuals(data),
        backgroundColor: 'var(--node-background)',
        borderColor: 'var(--node-border)',
      }}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />

      <div className="map-node-content">
        <span className="mb-1 block font-mono text-[10px] tracking-wide text-route">{data.type}</span>
        <div className="text-sm font-medium text-ink">{data.label}</div>
        <button
          type="button"
          data-node-details={id}
          onClick={(event) => {
            event.stopPropagation();
            useHiringMapStore.getState().toggleDetails(id);
          }}
          aria-label={detailsOpen ? `Close details for ${data.label}` : `Open details for ${data.label}`}
          title={detailsOpen ? 'Close details' : 'Open details'}
            className="absolute right-8 top-2 inline-flex h-5 w-5 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-route-soft hover:text-route focus-visible:ring-2 focus-visible:ring-route"
        >
          {detailsOpen
            ? <PanelRightClose aria-hidden="true" size={13} />
            : <PanelRightOpen aria-hidden="true" size={13} />}
        </button>
        {expandable && (
          <button
            type="button"
            data-node-chevron={id}
            onClick={(event) => {
              event.stopPropagation();
              const { select, toggleExpand } = useHiringMapStore.getState();
              select(id);
              toggleExpand(id);
            }}
            aria-label={`${data.label}: ${data.expanded ? 'collapse' : 'expand'}`}
            title={data.expanded ? 'Collapse' : 'Expand'}
            className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-route-soft hover:text-route focus-visible:ring-2 focus-visible:ring-route"
          >
            <GitBranch
              aria-hidden="true"
              size={15}
              className={`transition-transform ${data.expanded ? 'rotate-90' : 'rotate-0'}`}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {tooltipOpen && !data.exiting && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 4 }}
            transition={reduceMotion ? { duration: 0 } : getMotionTransition('focus')}
            role="tooltip"
            className="pointer-events-none absolute left-0 top-[calc(100%+0.5rem)] z-30 w-56 rounded-node border border-border bg-surface-1 p-3 text-xs text-ink-muted shadow-panel"
          >
            {summary}
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Right} className={handleClass} />
    </motion.div>
  );
}
