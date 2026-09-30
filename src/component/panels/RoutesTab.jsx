import { ArrowRight, Route } from 'lucide-react';
import { getMockRoutes } from '../../config/situation';
import { useHiringMapStore } from '../../store/hiringMapStore';

export function RoutesTab() {
  const situation = useHiringMapStore((state) => state.situation);
  const routes = getMockRoutes(situation);

  if (routes.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center text-center">
        <Route aria-hidden="true" size={22} className="text-ink-faint" />
        <h3 className="mt-3 text-sm font-semibold text-ink">No routes yet</h3>
        <p className="mt-1 max-w-64 text-xs text-ink-muted">Choose a role in My situation to find starting routes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {routes.map((route) => (
        <article key={route.id} className="rounded-node border border-border bg-surface-2 p-3">
          <h3 className="text-sm font-semibold text-ink">{route.title}</h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">{route.summary}</p>
          <ol className="mt-3 space-y-1.5">
            {route.steps.map((step, index) => (
              <li key={`${route.id}-${step}`} className="flex items-center gap-1.5 text-xs text-ink-muted">
                {index > 0 && <ArrowRight aria-hidden="true" size={12} className="shrink-0 text-route" />}
                <span className={index === route.steps.length - 1 ? 'font-medium text-ink' : ''}>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
