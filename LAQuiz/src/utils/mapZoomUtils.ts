export interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export const BASE_MAP_WIDTH = 959;
export const BASE_MAP_HEIGHT = 593;
export const MAX_ZOOM_SCALE = 4;
export const MIN_ZOOM_SCALE = 1;
export const ZOOM_STEP = 1.4;

export const INITIAL_ZOOM: ZoomState = {
  scale: 1,
  x: 0,
  y: 0,
};

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function formatViewBox(zoom: ZoomState): string {
  const visibleW = BASE_MAP_WIDTH / zoom.scale;
  const visibleH = BASE_MAP_HEIGHT / zoom.scale;
  return `${zoom.x.toFixed(1)} ${zoom.y.toFixed(1)} ${visibleW.toFixed(1)} ${visibleH.toFixed(1)}`;
}

export function calculateZoomIn(current: ZoomState): ZoomState {
  const newScale = clamp(current.scale * ZOOM_STEP, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE);
  if (newScale === current.scale) return current;

  const currentW = BASE_MAP_WIDTH / current.scale;
  const currentH = BASE_MAP_HEIGHT / current.scale;
  const centerX = current.x + currentW / 2;
  const centerY = current.y + currentH / 2;

  const newW = BASE_MAP_WIDTH / newScale;
  const newH = BASE_MAP_HEIGHT / newScale;
  const newX = clamp(centerX - newW / 2, 0, BASE_MAP_WIDTH - newW);
  const newY = clamp(centerY - newH / 2, 0, BASE_MAP_HEIGHT - newH);

  return { scale: newScale, x: newX, y: newY };
}

export function calculateZoomOut(current: ZoomState): ZoomState {
  const newScale = clamp(current.scale / ZOOM_STEP, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE);
  if (newScale <= 1.05) {
    return { scale: 1, x: 0, y: 0 };
  }

  const currentW = BASE_MAP_WIDTH / current.scale;
  const currentH = BASE_MAP_HEIGHT / current.scale;
  const centerX = current.x + currentW / 2;
  const centerY = current.y + currentH / 2;

  const newW = BASE_MAP_WIDTH / newScale;
  const newH = BASE_MAP_HEIGHT / newScale;
  const newX = clamp(centerX - newW / 2, 0, BASE_MAP_WIDTH - newW);
  const newY = clamp(centerY - newH / 2, 0, BASE_MAP_HEIGHT - newH);

  return { scale: newScale, x: newX, y: newY };
}

export function calculatePan(
  current: ZoomState,
  startX: number,
  startY: number,
  deltaClientX: number,
  deltaClientY: number,
  clientWidth: number,
  clientHeight: number
): ZoomState {
  if (current.scale <= 1 || clientWidth <= 0 || clientHeight <= 0) {
    return current;
  }

  const visibleW = BASE_MAP_WIDTH / current.scale;
  const visibleH = BASE_MAP_HEIGHT / current.scale;
  const factorX = visibleW / clientWidth;
  const factorY = visibleH / clientHeight;

  const newX = clamp(startX - deltaClientX * factorX, 0, BASE_MAP_WIDTH - visibleW);
  const newY = clamp(startY - deltaClientY * factorY, 0, BASE_MAP_HEIGHT - visibleH);

  return { scale: current.scale, x: newX, y: newY };
}
