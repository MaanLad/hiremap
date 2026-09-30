import { useEffect, useRef } from 'react';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { SITUATION_FIELDS } from '../../config/situation';
import { useHiringMapStore } from '../../store/hiringMapStore';

export function SituationButton() {
  const containerRef = useRef(null);
  const situationOpen = useHiringMapStore((state) => state.situationOpen);
  const toggleSituation = useHiringMapStore((state) => state.toggleSituation);

  useEffect(() => {
    if (!situationOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) toggleSituation();
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') toggleSituation();
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [situationOpen, toggleSituation]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleSituation}
        aria-expanded={situationOpen}
        aria-haspopup="dialog"
        aria-label="Set my situation"
        title="Set my situation"
        className="inline-flex h-9 items-center gap-1.5 rounded-node border border-border bg-surface-1 px-3 text-xs text-ink-muted transition-colors hover:border-route-border hover:text-route focus-visible:ring-2 focus-visible:ring-route"
      >
        <SlidersHorizontal aria-hidden="true" size={15} />
        <span>My situation</span>
        <ChevronDown aria-hidden="true" size={13} className={situationOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {situationOpen && <SituationCard />}
    </div>
  );
}

export function SituationCard() {
  const situation = useHiringMapStore((state) => state.situation);
  const setSituation = useHiringMapStore((state) => state.setSituation);
  const toggleSituation = useHiringMapStore((state) => state.toggleSituation);
  const setPanelTab = useHiringMapStore((state) => state.setPanelTab);
  const openPanel = useHiringMapStore((state) => state.openPanel);

  const toggleMultiValue = (value) => {
    const has = situation.has.includes(value)
      ? situation.has.filter((item) => item !== value)
      : [...situation.has, value];
    setSituation({ has });
  };

  const findRoutes = () => {
    setPanelTab('routes');
    openPanel();
    if (useHiringMapStore.getState().situationOpen) toggleSituation();
  };

  return (
    <div
      role="dialog"
      aria-label="My situation"
      className="absolute right-0 top-11 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-panel border border-border bg-surface-1 p-4 shadow-panel dark:shadow-panel-dark"
    >
      <div className="mb-4 flex items-start gap-2 border-b border-border pb-3">
        <SlidersHorizontal aria-hidden="true" size={16} className="mt-0.5 text-route" />
        <div>
          <h2 className="text-sm font-semibold text-ink">My situation</h2>
          <p className="mt-0.5 text-xs text-ink-muted">Tell us enough to find a useful starting route.</p>
        </div>
      </div>

      <div className="space-y-4">
        {SITUATION_FIELDS.map((field) => (
          <fieldset key={field.id}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{field.label}</legend>
            <div className="flex flex-wrap gap-2">
              {field.options.map((option) => {
                const isSelected = field.selection === 'multi'
                  ? situation.has.includes(option.id)
                  : situation[field.id] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => field.selection === 'multi'
                      ? toggleMultiValue(option.id)
                      : setSituation({ [field.id]: option.id })}
                    aria-pressed={isSelected}
                    className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-route ${isSelected ? 'border-route bg-route-soft text-route' : 'border-border bg-surface-1 text-ink-muted hover:border-border-strong hover:text-ink'}`}
                  >
                    {isSelected && <Check aria-hidden="true" size={12} />}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        onClick={findRoutes}
        disabled={!situation.role}
        className="mt-5 inline-flex w-full items-center justify-center rounded-node bg-route px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-route-hover disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-route focus-visible:ring-offset-2"
      >
        Find my routes
      </button>
    </div>
  );
}
