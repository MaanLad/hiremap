export const MAP_ANIMATION = {
  durationMs: 420,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export const getMapTransition = (properties = 'all') => properties
  .split(',')
  .map((property) => `${property.trim()} ${MAP_ANIMATION.durationMs}ms ${MAP_ANIMATION.easing}`)
  .join(', ');
