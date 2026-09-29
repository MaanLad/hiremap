import { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MAP_ANIMATION } from '../../config/animation';
import { getNodeVisuals } from './nodeVisuals';

export function HiringLevelNode({ data }) {
  const [visible] = useNodeEntrance(data);
  const expandable = Boolean(data.level) && data.level !== 'hiringProcess';
  const handleClass = '!h-2 !w-2 !border-none !bg-route';

  return (
    <div
      className={`origin-top transition-all ease-out
        ${visible ? 'scale-y-100 opacity-100' : 'scale-y-75 opacity-0 blur-sm'}
        min-w-45 rounded-node border bg-surface-1 px-4 py-3 shadow-node
        ${expandable ? 'cursor-pointer border-route-border hover:border-route' : 'border-border'}`}
      style={{
        ...getNodeVisuals(data),
        backgroundColor: 'var(--node-background)',
        borderColor: 'var(--node-border)',
        transitionDuration: `${MAP_ANIMATION.durationMs}ms`,
        transitionTimingFunction: MAP_ANIMATION.easing,
      }}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />

      <div className={`transition-[filter] duration-500 ease-out ${visible ? 'blur-none' : 'blur-[3px]'}`}>
        <span className="mb-1 block font-mono text-[10px] tracking-wide text-route">{data.type}</span>
        <div className="text-sm font-medium text-ink">{data.label}</div>
        {expandable && <div className="mt-1 text-xs text-ink-muted">Click to expand or collapse</div>}
      </div>

      <Handle type="source" position={Position.Right} className={handleClass} />
    </div>
  );
}

function useNodeEntrance(data) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const outer = requestAnimationFrame(() => {
      const inner = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(inner);
    });
    return () => cancelAnimationFrame(outer);
  }, []);

  return [entered && !data.exiting];
}
