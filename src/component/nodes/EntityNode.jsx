import { Handle, Position } from '@xyflow/react';

/**
 * Themed node for the hiring map.
 * `data.type`  — e.g. "ORG", "CHANNEL", "STAGE", "ENTRY" (small mono tag)
 * `data.label` — the node's name, e.g. "Product Company", "LinkedIn"
 * `data.subtitle` — optional one-line description
 */
export function EntityNode({ data, selected }) {
  return (
    <div
      className={`min-w-[190px] max-w-[220px] rounded-node border bg-surface-1 px-4 py-3
                  shadow-node transition-colors dark:shadow-node-dark
                  ${selected ? 'border-route' : 'border-border hover:border-border-strong'}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-none !bg-route"
      />

      {data.type && (
        <span
          className="mb-1.5 inline-block rounded-full bg-route-soft px-2 py-0.5
                     font-mono text-[10px] tracking-wide text-route"
        >
          {data.type}
        </span>
      )}

      <div className="text-sm font-medium leading-snug text-ink">{data.label}</div>

      {data.subtitle && (
        <div className="mt-0.5 text-xs leading-snug text-ink-muted">{data.subtitle}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-none !bg-route"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-none !bg-route"
      />
    </div>
  );
}

export const nodeTypes = { entity: EntityNode };