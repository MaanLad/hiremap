import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { LEVEL_LEGEND } from '../nodes/nodeVisuals';
import { getMapTransition } from '../../config/animation';

export function MapLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close map color guide' : 'Open map color guide'}
        title={open ? 'Close map color guide' : 'Open map color guide'}
        className="inline-flex h-9 w-9 items-center justify-center rounded-node
                   border border-border bg-surface-1 text-ink-muted transition-colors
                   hover:border-route-border hover:text-route"
      >
        {open ? <X size={16} /> : <Info size={16} />}
      </button>

      <div
        aria-hidden={!open}
        className={`absolute right-0 top-11 w-64 origin-top-right overflow-hidden rounded-panel
                    border border-border bg-surface-1 shadow-panel dark:shadow-panel-dark
                    ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          maxHeight: open ? '28rem' : '0px',
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-8px)',
          transition: getMapTransition('max-height, opacity, transform'),
        }}
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-ink">Map color guide</div>
              <div className="mt-0.5 text-xs text-ink-muted">Border color shows the hiring level.</div>
            </div>
            <Info size={15} className="text-ink-faint" />
          </div>

          <div className="space-y-2">
            {LEVEL_LEGEND.map(({ level, title, color }) => (
              <div key={level} className="flex items-center gap-2.5 text-xs text-ink-muted">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-sm border-2"
                  style={{ borderColor: color }}
                />
                <span>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
