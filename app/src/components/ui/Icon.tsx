import type { SVGProps } from 'react';

// Minimal original line-icon set (no external icon dependency).
const PATHS: Record<string, string> = {
  terminal: 'M4 17l6-6-6-6M12 19h8',
  crosshair: 'M12 3v3m0 12v3m9-9h-3M6 12H3M12 8a4 4 0 100 8 4 4 0 000-8z',
  shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z',
  sparkles: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z',
  network: 'M12 3a3 3 0 100 6 3 3 0 000-6zM5 15a3 3 0 100 6 3 3 0 000-6zM19 15a3 3 0 100 6 3 3 0 000-6zM12 9v3m0 0l-5 3m5-3l5 3',
  flame: 'M12 3c2 3 5 5 5 9a5 5 0 01-10 0c0-2 1-3 1-3 0 1 1 2 2 2 0-3 1-5 2-8z',
  crown: 'M3 7l4 5 5-7 5 7 4-5-2 12H5L3 7z',
  droplet: 'M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z',
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  map: 'M9 4L3 7v13l6-3 6 3 6-3V4l-6 3-6-3z',
  trophy: 'M7 4h10v3a5 5 0 01-10 0V4zM5 4H3v2a3 3 0 003 3M19 4h2v2a3 3 0 01-3 3M9 14h6v3H9z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6',
  search: 'M11 4a7 7 0 105 12l4 4M11 4a7 7 0 015 12',
  bolt: 'M13 3L4 14h6l-1 7 9-11h-6l1-7z',
  clock: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  star: 'M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9 9l3-6z',
  check: 'M5 13l4 4L19 7',
  play: 'M6 4l14 8-14 8V4z',
  lock: 'M6 11V8a6 6 0 1112 0v3M5 11h14v9H5v-9z',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h9',
  chevron: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 6h16M4 12h16M4 18h16',
  send: 'M4 12l16-7-7 16-2-7-7-2z',
  copy: 'M9 9h10v10H9zM5 15H4V4h11v1',
  cpu: 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7z',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  book: 'M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z',
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof PATHS | string;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const d = PATHS[name] || PATHS.star;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
