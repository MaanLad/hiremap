export const MAP_ANIMATION = {
  durationMs: 420,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  motionEase: [0.22, 1, 0.36, 1],
};

export const MAP_ANIMATION_VARIANTS = {
  default: MAP_ANIMATION,
  panel: {
    durationMs: 760,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    motionEase: [0.16, 1, 0.3, 1],
  },
  focus: {
    durationMs: 300,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    motionEase: [0.22, 1, 0.36, 1],
  },
};

export const MAP_VISUAL_OPACITY = {
  selected: 1,
  connected: 0.78,
  untouched: 0.64,
  connectedEdge: 0.92,
  untouchedEdge: 0.58,
};

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const getMapAnimation = (variant = 'default') => (
  MAP_ANIMATION_VARIANTS[variant] ?? MAP_ANIMATION_VARIANTS.default
);

export const getMotionTransition = (variant = 'default', overrides = {}) => {
  const { durationMs, motionEase } = getMapAnimation(variant);
  return { duration: durationMs / 1000, ease: motionEase, ...overrides };
};

export const getMapTransition = (properties = 'all', variant = 'default') => properties
  .split(',')
  .map((property) => {
    const { durationMs, easing } = getMapAnimation(variant);
    return `${property.trim()} ${durationMs}ms ${easing}`;
  })
  .join(', ');

export const getPanelTransition = (properties = 'transform, opacity') => (
  getMapTransition(properties, 'panel')
);

export const getReducedMotionCss = (selectors) => `
  @media ${REDUCED_MOTION_QUERY} {
    ${selectors} {
      transition: none !important;
      animation: none !important;
      filter: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export const getReducedMotionTransitionCss = (selectors) => `
  @media ${REDUCED_MOTION_QUERY} {
    ${selectors} {
      transition: none !important;
    }
  }
`;
